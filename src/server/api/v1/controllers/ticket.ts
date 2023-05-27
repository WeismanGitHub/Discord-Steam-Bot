import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { BadRequestError, InternalServerError } from '../../../errors';
import { CustomClient } from '../../../custom-client';
import { infoEmbed } from '../../../utils/embeds';
import { TicketModel } from '../../../db/models';
import { Request, Response } from 'express';
import { Config } from '../../../../config';
require('express-async-errors')

async function getTickets(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 0
    const status = req.query.status

    if (!Number.isSafeInteger(page) || page < 0) {
        throw new BadRequestError('Page is invalid.')
    }

    if (status && !['closed', 'open'].includes(String(status))) {
        throw new BadRequestError('Invalid status.')
    }

    const tickets = await TicketModel.find(status ? { status } : {})
    .skip(page * 10).limit(10).select('_id title status').lean()
    .catch(err => {
        throw new InternalServerError('Could not get user ids.')
    })

    res.status(200).json(tickets)
}

async function getTicket(req: Request, res: Response): Promise<void> {
    const { ticketID } = req.params

    const ticket = await TicketModel.findById(ticketID).select('-_id title text status response').lean()
    .catch(err => {
        throw new InternalServerError("Error finding ticket.")
    })

    res.status(200).json(ticket)
}

async function resolveTicket(req: Request, res: Response): Promise<void> {
    const client: CustomClient = req.app.get('discordClient')
    const { ticketID } = req.params
    const { response } = req.body

    if (!response) {
        throw new BadRequestError('Missing response.')
    }

    if (response.length > 4096) {
        throw new BadRequestError('Maximum response length is 4096.')
    } else if (response.length < 1) {
        throw new BadRequestError('Minimum response length is 1.')
    }

    const ticket = await TicketModel.findOneAndUpdate(
        { _id: ticketID, status: 'open' },
        { response, resolverID: req.user?._id, status: 'closed' }
    )

    if (!ticket) {
        throw new BadRequestError("Could not resolve ticket.")
    }

    const ticketCreator = await client.users.fetch(ticket.userID)
    .catch(err => {
        throw new InternalServerError('Could not get ticket creator.')
    })

    const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents([
        new ButtonBuilder()
        .setLabel('View Your Ticket')
        .setURL(`${Config.websiteLink}tickets/${ticket.id}`)
        .setStyle(ButtonStyle.Link)
    ])

    await ticketCreator.send({
        embeds: [infoEmbed('Your ticket has been resolved.')],
        components: [row],
    })
    .catch(err => {
        throw new InternalServerError('Could not respond to ticket creator.')
    })

    res.status(200).end()
}

export {
    getTickets,
    getTicket,
    resolveTicket,
}