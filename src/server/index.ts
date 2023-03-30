import express, { Application, NextFunction, Request, Response } from 'express';
import { ActivityType, GatewayIntentBits } from 'discord.js';
import InternalServerError from './errors/internal-server';
import { CustomClient } from './custom-client';
import rateLimit from 'express-rate-limit';
import fetchMetadata from 'fetch-metadata';
import authRouter from './routers/auth';
import { CustomError } from './errors';
import compression from 'compression'
require('express-async-errors')
import helmet from 'helmet'
import cors from 'cors'

const client: CustomClient = new CustomClient({
    intents: [
        GatewayIntentBits.Guilds,
    ],
});

const port: number = Number(process.env.PORT) || 5000;
const max: number = 15

const app: Application = express();
app.set('discordClient', client);

client.on('ready', (): void => {
	console.log('bot is ready...')
    client.setPresence(ActivityType.Playing, 'on Steam')
})

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

app.use(
	fetchMetadata({
	  allowedFetchSites: ['same-origin', 'same-site', 'none'],
	  disallowedNavigationRequests: ['frame', 'iframe'],
	  errorStatusCode: 403,
	  allowedPaths: [],
	  onError: (request, response, next, options) => {
		response.statusCode = options.errorStatusCode
		response.end()
	  },
	})
)

app.use(limiter)
app.use(compression())
app.use(cors({ origin: ['http://localhost:5000'] }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/v1/auth', authRouter)

app.get('/links/discord', (req: Request, res: Response): void => {
	const redirectURL: string | undefined = process.env.DISCORD_OAUTH_URL

	if (!redirectURL) {
		throw new InternalServerError('Discord OAuth URL is undefined.')
	}

	res.status(200).redirect(redirectURL)
})

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(err.message)
    res.status(err.statusCode || 500).send(err.message)
})

app.listen(port, (): void => console.log(`listening on port ${port}...`));