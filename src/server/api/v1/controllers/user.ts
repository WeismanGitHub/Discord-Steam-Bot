import { getPlayerSummaries, getSteamLevel } from '../../../utils/steam';
import { CustomClient } from '../../../custom-client';
import { TicketModel, UserModel } from '../../../db/models';
import { Request, Response } from 'express';
import { DiscordAPIError } from 'discord.js';
require('express-async-errors')
import {
    BadGatewayError,
    BadRequestError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError
} from '../../../errors';

async function getSelf(req: Request, res: Response): Promise<void> {
    const client: CustomClient = req.app.get('discordClient')
    const discordID = req.user?._id

    if (!discordID) {
        throw new UnauthorizedError('Missing ID.')
    }

    const userDoc = await UserModel.findById(discordID).select('steamID role').lean()

    if (!userDoc) {
        throw new NotFoundError('Could not find user in database.')
    }

    const { steamID } = userDoc

    const discordUserData = await client.users.fetch(discordID)
    .catch((err: DiscordAPIError) => {
        if (err.status >= 400 && err.status < 500) {
            throw new BadRequestError(err.message)
        }

        throw new InternalServerError(err.message)
    })

    const steamRes = await Promise.all([
        getPlayerSummaries(userDoc.steamID),
        getSteamLevel(steamID)
    ])
    .catch((err: Error): void => {
        throw new BadGatewayError('Could not get user data.')
    })

    if (!steamRes) {
        throw new InternalServerError('Could not get Steam Data')
    }
    
    const steamUserData = steamRes?.[0]?.[0]
    const steamLevel = steamRes[1]
    
    if (!steamUserData || steamLevel === undefined) {
        throw new InternalServerError('Could not get Steam Data')
    }

    res.status(200).json({
        role: userDoc.role,
        steam: {
            ID: steamID,
            level: steamLevel,
            avatarURL: steamUserData.avatarfull,
            name: steamUserData.personaname,
            createdTimestamp: `${steamUserData.timecreated}000`
        },
        discord: {
            ID: discordID,
            name: discordUserData.username,
            avatarURL: discordUserData.avatarURL(),
            discriminator: discordUserData.discriminator,
            createdTimestamp: discordUserData.createdTimestamp,
        }
    })
}

async function deleteSelf(req: Request, res: Response): Promise<void> {
    const discordID = req.user?._id

    if (!discordID) {
        throw new UnauthorizedError('Missing ID.')
    }

    const userDoc = await UserModel.findById(discordID)

    if (!userDoc) {
        throw new NotFoundError('Could not find user in database.')
    }

    if (userDoc.role == 'banned') {
        const res = await userDoc.updateOne({ steamID: null })
        console.log(res)
    } else {
        const res = await userDoc.deleteOne()
        console.log(res)
    }

    res.status(200).end()
}

async function getUsers(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 0

    if (!Number.isSafeInteger(page) || page < 0) {
        throw new BadRequestError('Page is invalid.')
    }
    
    const userIDs = (await UserModel.find({ role: 'user' }).skip(page * 10).limit(10).select('_id').lean()
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

async function getBannedUsers(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 0

    if (!Number.isSafeInteger(page) || page < 0) {
        throw new BadRequestError('Page is invalid.')
    }
    
    const userIDs = (await UserModel.find({ role: 'banned' }).skip(page * 10).limit(10).select('_id').lean()
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

async function getAdmins(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 0

    if (!Number.isSafeInteger(page) || page < 0) {
        throw new BadRequestError('Page is invalid.')
    }

    const adminIDs = (await UserModel.find({ role: 'admin' }).skip(page * 10).limit(10).select('_id').lean()
    .catch(err => {
        throw new InternalServerError('Could not get admin ids.')
    })).map(admin => admin._id)

    const admins = await Promise.all(adminIDs.map(async (adminID) => {
        const client: CustomClient = req.app.get('discordClient')

        const admin = await client.users.fetch(adminID)
        .catch(err => {
            throw new InternalServerError('Could not get admins.')
        })

        return {
            name: admin.username,
            avatarURL: admin.avatarURL(),
        }
    }))

    res.status(200).json(admins)
}

async function getOwners(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 0

    if (!Number.isSafeInteger(page) || page < 0) {
        throw new BadRequestError('Page is invalid.')
    }

    const ownerIDs = (await UserModel.find({ role: 'owner' }).skip(page * 10).limit(10).select('_id').lean()
    .catch(err => {
        throw new InternalServerError('Could not get owner ids.')
    })).map(owner => owner._id)

    const owners = await Promise.all(ownerIDs.map(async (ownerID) => {
        const client: CustomClient = req.app.get('discordClient')

        const owner = await client.users.fetch(ownerID)
        .catch(err => {
            throw new InternalServerError('Could not get owners.')
        })

        return {
            name: owner.username,
            avatarURL: owner.avatarURL()
        }
    }))

    res.status(200).json(owners)
}

async function promoteUser(req: Request, res: Response): Promise<void> {
    const { userID } = req.params

    const user = await UserModel.findById(userID)

    if (!user) {
        throw new NotFoundError('Could not find user.')
    }

    await user.promote()

    res.status(200).end()
}

async function demoteUser(req: Request, res: Response): Promise<void> {
    const { userID } = req.params

    const user = await UserModel.findById(userID)

    if (!user) {
        throw new NotFoundError('Could not find user.')
    }

    await user.demote()

    res.status(200).end()
}

async function getSelfTickets(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 0
    const status = req.query.status
    const userID = req.user?._id

    if (!userID) {
        throw new UnauthorizedError('Missing ID.')
    }

    if (!Number.isSafeInteger(page) || page < 0) {
        throw new BadRequestError('Page is invalid.')
    }

    if (status && ['closed', 'open'].includes(String(status))) {
        throw new BadRequestError('Invalid status.')
    }

    const tickets = await TicketModel.find(status ? { status, userID } : { userID })
    .skip(page * 10).limit(10).select('_id title status response').lean()
    .catch(err => {
        throw new InternalServerError('Could not get user ids.')
    })

    res.status(200).json(tickets)
}
export {
    getSelf,
    deleteSelf,
    getBannedUsers,
    getUser,
    unbanUser,
    banUser,
    getUsers,
    getAdmins,
    getOwners,
    demoteUser,
    promoteUser,
    getSelfTickets,
}