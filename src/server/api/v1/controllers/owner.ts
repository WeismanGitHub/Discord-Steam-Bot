import { BadRequestError, InternalServerError } from '../../../errors';
import { CustomClient } from '../../../custom-client';
import { UserModel } from '../../../db/models';
import { Request, Response } from 'express';
import { ActivityType } from 'discord.js';
require('express-async-errors')
import fs from 'fs'

async function getAdmins(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 0

    if (!Number.isSafeInteger(page) || page < 0) {
        throw new BadRequestError('Page is invalid.')
    }

    const adminIDs = (await UserModel.find({ level: 'admin' }).skip(page).limit(10).select('_id').lean()
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

    const ownerIDs = (await UserModel.find({ level: 'owner' }).skip(page).limit(10).select('_id').lean()
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

function killProcess(req: Request, res: Response): void {
    console.log('owner killed process...')
    res.status(202).end()
    process.exit(0)
}

async function setStatus(req: Request, res: Response): Promise<void> {
    const { name, type }: { name: string | undefined, type: ActivityType | undefined } = req.body

    if (!name || !type) {
        throw new BadRequestError('Missing name or type.')
    }

    if (name.length > 50) {
        throw new BadRequestError('Name must be less than 50 characters.')
    }

    fs.writeFile('../../../../../activity.json', JSON.stringify({ name: 'sdfs', }), (err) => {
        console.log(err)
    })

    res.status(200).end()
}

export {
    getAdmins,
    getOwners,
    killProcess,
    setStatus,
}
