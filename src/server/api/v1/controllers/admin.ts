import { CustomClient } from '../../../custom-client';
import { BadRequestError, InternalServerError } from '../../../errors';
import { UserModel } from '../../../db/models';
import { Request, Response } from 'express';
import { config } from '../../../../config';
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

    res.status(200).json(guilds)
}

async function getUsers(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 0

    if (!Number.isSafeInteger(page) || page < 0) {
        throw new BadRequestError('Page is invalid.')
    }
    
    const userIDs = (await UserModel.find({}).skip(page).limit(10).select('_id').lean()
    .catch(err => {
        throw new InternalServerError('Could not get user ids.')
    })).map(user => user._id)

    const users = await Promise.all(userIDs.map(async (userID) => {
        const client: CustomClient = req.app.get('discordClient')

        const user = await client.users.fetch(userID)
        .catch(err => {
            throw new InternalServerError('Could not get users.')
        })

        return {
            username: user.username,
            avatar: user.avatarURL(),
        }
    }))

    console.log(users)

    res.status(200).json(users)
}

async function getBotData(req: Request, res: Response): Promise<void> {
    const client: CustomClient = req.app.get('discordClient')

    res.status(200)
    .json({
        readyTimestamp: client.readyTimestamp,
        avatar: client.user?.avatarURL(),
        presence: config.discordStatus,
    })
}

export { getBotGuilds, getUsers, getBotData }
