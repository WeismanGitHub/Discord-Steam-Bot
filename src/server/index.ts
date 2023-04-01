import express, { Application, NextFunction, Request, Response } from 'express';
import { ActivityType, GatewayIntentBits } from 'discord.js';
import InternalServerError from './errors/internal-server';
import { CustomError, NotFoundError } from './errors';
import { CustomClient } from './custom-client';
import rateLimit from 'express-rate-limit';
import fetchMetadata from 'fetch-metadata';
import authRouter from './routers/auth';
import compression from 'compression'
require('express-async-errors')
import helmet from 'helmet'
import cors from 'cors'
import path from 'path'

const client: CustomClient = new CustomClient({
    intents: [
        GatewayIntentBits.Guilds,
    ],
});

const app: Application = express();
app.set('discordClient', client);

const port: number = Number(process.env.PORT) || 5000;
const max: number = 15

const limiter = rateLimit({
    windowMs: 1000,
	max: max,
	standardHeaders: true,
	legacyHeaders: false,
	message: `Rate Limit: ${max} requests per second`
})

app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			...helmet.contentSecurityPolicy.getDefaultDirectives(),
			"img-src": ["'self'"],
			'media-src': ["'self'"],
			"default-src": ["'self'"]
		},
	},
	crossOriginEmbedderPolicy: false
}))

app.use(fetchMetadata({
	allowedFetchSites: ['same-origin', 'same-site', 'none'],
	disallowedNavigationRequests: ['frame', 'iframe'],
	errorStatusCode: 403,
	allowedPaths: [],
	onError: (request, response, next, options) => {
		response.statusCode = options.errorStatusCode
		response.end()
	}
}))

app.use(limiter)
app.use(compression())
app.use(cors({ origin: ['http://localhost:5000'] }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/v1/auth', authRouter)

app.use('/api/*', (req: Request, res: Response, next: NextFunction): void => {
	throw new NotFoundError('Route does not exist.')
})

app.get('/*', (req, res) => {
	res.status(200).sendFile(path.resolve(__dirname, '../client/build/index.html'))
})

app.get('/links/discord', (req: Request, res: Response): void => {
	const redirectURL: string | undefined = process.env.DISCORD_OAUTH_URL

	if (!redirectURL) {
		throw new InternalServerError('Discord OAuth URL is undefined.')
	}

	res.status(200).redirect(redirectURL)
})

app.use((err: CustomError, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.message)
    res.status(err.statusCode || 500).send(err.message)
})

client.on('ready', (): void => {
	console.log('bot is ready...')
    client.setPresence(ActivityType.Playing, 'something')
})

app.listen(port, (): void => console.log(`listening on port ${port}...`));