// import { BadRequestError, InternalServerError } from '../../../errors';
// import { UserModel } from '../../../db/models';
import { Request, Response } from 'express';
// import { config } from '../../../../config';
require('express-async-errors')

async function getBotGuilds(req: Request, res: Response): Promise<void> {
    res.status(200).end()
}

export { getBotGuilds }
