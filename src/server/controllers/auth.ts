import { Request, Response } from 'express';

async function steamAuth(req: Request, res: Response): Promise<void> {
    res.status(200).send('steam auth');
}

async function discordAuth(req: Request, res: Response): Promise<void> {
    res.status(200).send('discord auth');
}

export { steamAuth, discordAuth }