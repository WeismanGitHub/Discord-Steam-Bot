import { BadRequestError, InternalServerError } from '../../../errors';
import { TicketModel } from '../../../db/models';
import { Request, Response } from 'express';
require('express-async-errors')

async function getTickets(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 0
    const status = req.query.status

    if (!Number.isSafeInteger(page) || page < 0) {
        throw new BadRequestError('Page is invalid.')
    }

    if (status && ['closed', 'open'].includes(String(status))) {
        throw new BadRequestError('Invalid status.')
    }

    const tickets = await TicketModel.find(status ? { status } : {})
    .skip(page * 10).limit(10).select('-text').lean()
    .catch(err => {
        throw new InternalServerError('Could not get user ids.')
    })

    res.status(200).json(tickets)
}

async function getTicket(req: Request, res: Response): Promise<void> {
    const { ticketID } = req.params

    const ticket = await TicketModel.findById(ticketID).select('-_id title text status response').lean()

    res.status(200).json(ticket)
}

async function createTicket(req: Request, res: Response): Promise<void> {
    const { title, text } = req.body
    const userID = req.user?._id

    if (!userID || !title || !text) {
        throw new BadRequestError('Missing userID, title, or text.')
    }

    const ticket = await TicketModel.create({
        userID,
        title,
        text
    })

    res.status(200).json({ ticketID: ticket._id })
}

async function resolveTicket(req: Request, res: Response): Promise<void> {
    const { ticketID } = req.params
    const { response } = req.body

    if (!response) {
        throw new BadRequestError('Missing response.')
    }

    const result = await TicketModel.updateOne(
        { _id: ticketID, status: 'open' },
        { response, resolverID: req.user?._id, status: 'closed' }
    )

    if (!result.acknowledged || !result.modifiedCount) {
        throw new BadRequestError("Nothing was changed. Maybe this ticket has already been resolved.")
    }

    res.status(200).end()
}

export {
    getTickets,
    getTicket,
    createTicket,
    resolveTicket,
}