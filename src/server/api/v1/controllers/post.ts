import { Request, Response } from 'express';
require('express-async-errors')

async function getPosts(req: Request, res: Response): Promise<void> {
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