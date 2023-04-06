import { BadRequestError, NotFoundError, InternalServerError } from '../errors';
const DiscordOauth2 = require("discord-oauth2");
import { Request, Response } from 'express';
// import { UserModel } from '../db/models'
import { config } from '../../config'
require('express-async-errors')

async function steamAuth(req: Request, res: Response): Promise<void> {
    res.status(200).send('steam auth');
}

async function discordAuth(req: Request, res: Response): Promise<void> {
    const oauth = new DiscordOauth2();
    const { code } = req.body
    let connections: connection[];
    let userId: string;

    if (!code) {
        throw new BadRequestError('Missing Code')
    }

    try {
        const token: string = (await oauth.tokenRequest({
            clientId: config.discordClientID,
            clientSecret: config.discordClientSecret,
        
            code: code,
            scope: 'connections identify',
            grantType: "authorization_code",
            redirectUri: config.redirectURI,
        })).access_token

        connections = await oauth.getUserConnections(token)
        userId = (await oauth.getUser(token)).id
    } catch(err) {
        throw new InternalServerError('Something went wrong getting your connections.')
    }

    const steamConnection: connection | undefined = connections.find((connection: connection) => connection.type == 'steam')

    if (!steamConnection) {
        throw new NotFoundError('No Steam connection.')
    }

    console.log(userId, steamConnection)


    res.status(200).send('discord auth');
}

export { steamAuth, discordAuth }
