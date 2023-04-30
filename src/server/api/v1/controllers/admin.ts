import { BadRequestError, InternalServerError, NotFoundError } from '../../../errors';
import { CustomClient } from '../../../custom-client';
import { UserModel } from '../../../db/models';
import { Request, Response } from 'express';
import { ActivityType, DiscordAPIError } from 'discord.js';
require('express-async-errors')

async function getBotGuilds(req: Request, res: Response): Promise<void> {
    const client: CustomClient = req.app.get('discordClient')

    const guilds = client.guilds.cache.map((guild): GuildData => {
        return {
            name: guild.name,
            iconURL: guild.iconURL(),
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
    
    const userIDs = (await UserModel.find({ type: 'user' }).skip(page).limit(10).select('_id').lean()
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
            name: user.username,
            avatarURL: user.avatarURL(),
        }
    }))

    res.status(200).json(users)
}

async function getBot(req: Request, res: Response): Promise<void> {
    const client: CustomClient = req.app.get('discordClient')
    const activity = client.user?.presence.activities[0]

    res.status(200)
    .json({
        name: client.user?.username,
        createdTimestamp: client.user?.createdTimestamp,
        readyTimestamp: client.readyTimestamp,
        avatarURL: client.user?.avatarURL(),
        activity: {
            type: activity?.type !== undefined ? ActivityType[activity?.type] : 'unknown',
            name: activity?.name,
        },
    })
}

async function banUser(req: Request, res: Response): Promise<void> {
    const { userID } = req.params

    const user = await UserModel.findById(userID)

    if (!user) {
        throw new NotFoundError('Could not find user.')
    }

    await user.ban()

    res.status(200).end()
}

async function unbanUser(req: Request, res: Response): Promise<void> {
    const { userID } = req.params

    const user = await UserModel.findById(userID)

    if (!user) {
        throw new NotFoundError('Could not find user.')
    }

    await user.unban()

    res.status(200).end()
}

async function getUser(req: Request, res: Response): Promise<void> {
    const client: CustomClient = req.app.get('discordClient')

    const user = await client.users.fetch(req.params.userID)
    .catch((err: DiscordAPIError) => {
        if (err.status >= 400 && err.status < 500) {
            throw new BadRequestError(err.message)
        }

        throw new InternalServerError(err.message)
    })

    if (user.bot) {
        throw new BadRequestError('User is a bot')
    }

    res.status(200).json({
        name: user.username,
        avatarURL: user.avatarURL(),
        discriminator: user.discriminator,
        createdTimestamp: user.createdTimestamp,
        ID: user.id
    })
}

export {
    getBotGuilds,
    getUsers,
    getBot,
    banUser,
    getUser,
    unbanUser,
}
