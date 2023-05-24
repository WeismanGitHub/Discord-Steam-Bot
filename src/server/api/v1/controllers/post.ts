import { BadRequestError, InternalServerError } from '../../../errors';
import { PostModel } from '../../../db/models';
import { Request, Response } from 'express';
require('express-async-errors')

async function getPosts(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 0
    const status = req.query.status

    if (!Number.isSafeInteger(page) || page < 0) {
        throw new BadRequestError('Page is invalid.')
    }

    if (status && ['closed', 'open'].includes(String(status))) {
        throw new BadRequestError('Invalid status.')
    }

    const posts = await PostModel.find().skip(page * 10).limit(10).lean()
    .catch(err => {
        throw new InternalServerError('Could not get posts.')
    })

    res.status(200).json(posts)
}

async function createPost(req: Request, res: Response): Promise<void> {
}

async function deletePost(req: Request, res: Response): Promise<void> {
}

export {
    getPosts,
    createPost,
    deletePost,
}