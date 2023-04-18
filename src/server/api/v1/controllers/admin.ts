import { CustomClient } from '../../../custom-client';
import { BadRequestError } from '../../../errors';
import { UserModel } from '../../../db/models';
import { Request, Response } from 'express';
require('express-async-errors')

async function getBotGuilds(req: Request, res: Response): Promise<void> {
    const client: CustomClient = req.app.get('discordClient')

    const guilds = client.guilds.cache.map((guild): GuildData => {
        return {
            name: guild.name,
            icon: guild.iconURL(),
            memberCount: guild.memberCount,
            joinedTimestamp: guild.joinedTimestamp,
            preferredLocale: guild.preferredLocale,
        }
    })

    res.status(200).json({ guilds })
}

async function getUsers(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 0

    if (!Number.isSafeInteger(page) || page < 0) {
        throw new BadRequestError('Page is invalid.')
    }

    const users = await UserModel.find({}).skip(page).limit(10).lean()

    res.status(200).json({ users })
}

async function getBotData(req: Request, res: Response): Promise<void> {
    const client: CustomClient = req.app.get('discordClient')
    console.log(client)
    
    res.status(200).json({})
}

export { getBotGuilds, getUsers, getBotData }
