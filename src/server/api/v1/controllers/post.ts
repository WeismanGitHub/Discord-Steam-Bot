import { BadRequestError, InternalServerError } from '../../../errors';
import { PostModel } from '../../../db/models';
import { Request, Response } from 'express';
require('express-async-errors')

async function getPosts(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 0

    if (!Number.isSafeInteger(page) || page < 0) {
        throw new BadRequestError('Page is invalid.')
    }

    const posts = await PostModel.find().skip(page * 10).limit(10).lean()
    .catch(err => {
        throw new InternalServerError('Could not get posts.')
    })

    res.status(200).json(posts)
}

async function createPost(req: Request, res: Response): Promise<void> {
    const { title, text } = req.body
    const userID = req.user?._id

    if (!userID || !title || !text) {
        throw new BadRequestError('Missing userID, title, or text.')
    }

    if (title.length > 256) {
        throw new BadRequestError('Maximum title length is 256.')
    } else if (title.length < 1) {
        throw new BadRequestError('Minimum title length is 1.')
    }

    if (text.length > 4096) {
        throw new BadRequestError('Maximum text length is 4096.')
    } else if (text.length < 1) {
        throw new BadRequestError('Minimum text length is 1.')
    }

    await PostModel.create({ title, text })
    .catch(err => {
        throw new InternalServerError('Could not create post.')
    })

    res.status(200).end()
}

async function deletePost(req: Request, res: Response): Promise<void> {
    const { postID } = req.params

    const response = await PostModel.deleteOne({ _id: postID })
    .catch(err => {
        throw new InternalServerError('Could not delete post.')
    })

    if (!response.deletedCount || !response.acknowledged) {
        throw new InternalServerError("Could not delete post.")
    }

    res.status(200).end()
}

export {
    getPosts,
    createPost,
    deletePost,
}