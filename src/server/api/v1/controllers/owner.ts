import { BadRequestError } from '../../../errors';
import { UserModel } from '../../../db/models';
import { Request, Response } from 'express';
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
    res.status(202)
    process.exit(1)
}

export { getAdmins, getOwners, killProcess }
