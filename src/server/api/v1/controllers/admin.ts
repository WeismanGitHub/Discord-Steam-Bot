import { CustomClient } from '../../../custom-client';
// import { UserModel } from '../../../db/models';
import { Request, Response } from 'express';
require('express-async-errors')

async function getBotGuilds(req: Request, res: Response): Promise<void> {
    const client: CustomClient = req.app.get('discordClient')

    const guilds = client.guilds.cache.map((guild): GuildData => {
        return {
            name: guild.name,
            icon: guild.iconURL(),
            memberCount: guild.memberCount,
            joinedTimestamp: guild.joinedTimestamp,
            preferredLocale: guild.preferredLocale,
        }
    })

    res.status(200).json({ guilds: guilds })
}

export { getBotGuilds }
