import { BadRequestError } from '../../../errors';
import { UserModel } from '../../../db/models';
import { Request, Response } from 'express';
import { ActivityType } from 'discord.js';
require('express-async-errors')

async function getAdmins(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 0

    if (!Number.isSafeInteger(page) || page < 0) {
        throw new BadRequestError('Page is invalid.')
    }

    const admins = await UserModel.find({ level: 'admin' }).skip(page).limit(10).lean()

    res.status(200).json({ admins })
}

async function getOwners(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 0

    if (!Number.isSafeInteger(page) || page < 0) {
        throw new BadRequestError('Page is invalid.')
    }

    const owners = await UserModel.find({ level: 'owner' }).skip(page).limit(10).lean()

    res.status(200).json({ owners })
}

function killProcess(req: Request, res: Response): void {
    res.status(202).end()
    process.exit(1)
}

function restartProcess(req: Request, res: Response): void {
    res.status(202).end()
}

async function setStatus(req: Request, res: Response): Promise<void> {
    const { name, type }: { name: string | undefined, type: ActivityType | undefined } = req.body

    if (!name || !type) {
        throw new BadRequestError('Missing name or type.')
    }

    if (name.length > 50) {
        throw new BadRequestError('Name must be less than 50 characters.')
    }

    // write name + type to activity.json

    res.status(200).end()
}

export {
    getAdmins,
    getOwners,
    killProcess,
    restartProcess,
    setStatus,
}
