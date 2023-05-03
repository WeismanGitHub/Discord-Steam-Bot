import { BadGatewayError, BadRequestError, InternalServerError, NotFoundError, UnauthorizedError } from '../../../errors';
import { getPlayerSummaries, getSteamLevel } from '../../../utils/steam';
import { CustomClient } from '../../../custom-client';
import { UserModel } from '../../../db/models';
import { Request, Response } from 'express';
import { DiscordAPIError } from 'discord.js';
require('express-async-errors')

async function getSelf(req: Request, res: Response): Promise<void> {
    const client: CustomClient = req.app.get('discordClient')
    const discordID =req.userID

    if (!discordID) {
        throw new UnauthorizedError('Missing ID.')
    }

    const userDoc = await UserModel.findById(discordID).select('steamID type').lean()

    if (!userDoc) {
        throw new NotFoundError('Could not find user in database.')
    }

    const { type, steamID } = userDoc

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
        type: type,
        steam: {
            ID: steamID,
            level: steamLevel,
            avatarURL: steamUserData.avatarfull,
            name: steamUserData.personaname,
            createdTimestamp: steamUserData.timecreated
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
    const discordID = req.userID

    if (!discordID) {
        throw new UnauthorizedError('Missing ID.')
    }

    const userDoc = await UserModel.findById(discordID)

    if (!userDoc) {
        throw new NotFoundError('Could not find user in database.')
    }

    if (userDoc.type == 'banned') {
        const res = await userDoc.updateOne({ steamID: null })
        console.log(res)
    } else {
        const res = await userDoc.deleteOne()
        console.log(res)
    }

    res.status(200).end()
}

export {
    getSelf,
    deleteSelf,
}