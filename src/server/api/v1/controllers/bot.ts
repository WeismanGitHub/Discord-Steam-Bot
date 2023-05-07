import { BadRequestError, InternalServerError } from '../../../errors';
import { CustomClient } from '../../../custom-client';
import { Request, Response } from 'express';
import { ActivityType } from 'discord.js';
require('express-async-errors')
import fs from 'fs'

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

function killProcess(req: Request, res: Response): void {
    console.log('owner killed process...')
    res.status(202).end()
    process.exit(0)
}

async function setActivity(req: Request, res: Response): Promise<void> {
    const client: CustomClient = req.app.get('discordClient')
    const { name, type }: CustomActivity = req.body
    const numberType = Number(type)

    if (!name || type === undefined) {
        throw new BadRequestError('Missing name or type.')
    }

    if (ActivityType[numberType] === undefined || numberType === ActivityType.Custom) {
        throw new InternalServerError('Invalid activity type.')
    }

    if (name.length > 100 || name.length <= 0) {
        throw new BadRequestError('Name must between 1 and 100 characters.')
    }

    client.setPresence(numberType, name)

    fs.writeFile('activity.json', JSON.stringify({ type: numberType, name }, null, 2), (err) => {
        if (err) throw new InternalServerError('Could not save to activity.json.')

        res.status(200).end()
    })
}

export {
    getBot,
    getBotGuilds,
    killProcess,
    setActivity
}