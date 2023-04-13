import { BadRequestError, InternalServerError } from '../../../errors';
const DiscordOauth2 = require("discord-oauth2");
import { UserModel } from '../../../db/models';
import { Request, Response } from 'express';
import { config } from '../../../../config';
require('express-async-errors')
import jwt from 'jsonwebtoken';

async function discordAuth(req: Request, res: Response): Promise<void> {
    const oauth = new DiscordOauth2();
    const { code } = req.body
    let connections: connection[];
    let userID: string | undefined;

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
        userID = (await oauth.getUser(token)).id
    } catch(err) {
        throw new InternalServerError('Something went wrong getting your connections.')
    }

    if (!userID) {
        throw new InternalServerError('Could not get user ID.')
    }

    const steamConnection: connection | undefined = connections.find((connection: connection) => connection.type == 'steam')

    if (!steamConnection) {
        throw new BadRequestError('No Steam connection.')
    }

    await UserModel.updateOne(
        { _id: userID },
        { steamID: steamConnection.id },
        { upsert: true }
    )
    .catch(err => {
        throw new InternalServerError("Error creating user.")
    })

    const idJWT = jwt.sign(
        { userID },
        config.jwtSecret!,
        { expiresIn: '14d' },
    )

    res.status(200)
	.cookie('userID', idJWT, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		expires: new Date(Date.now() + (3600000 * 24 * 14)) // 14 days
	}).end()
}

function logout(req: Request, res: Response): void {
	res.status(200).clearCookie('userID').end()
}

export {
    discordAuth,
    logout,
}
