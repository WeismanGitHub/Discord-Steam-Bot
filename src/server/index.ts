import express, { Application, NextFunction, Request, Response } from 'express';
import { CustomError, NotFoundError } from './errors';
import { CustomClient } from './custom-client';
import { GatewayIntentBits } from 'discord.js';
import rateLimit from 'express-rate-limit';
import fetchMetadata from 'fetch-metadata';
import { connectDB } from './db/connect';
import authRouter from './routers/auth';
import compression from 'compression'
import { config } from '../config'
require('express-async-errors')
import { resolve } from 'path'
import helmet from 'helmet'
import cors from 'cors'

const client: CustomClient = new CustomClient({
    intents: [
        GatewayIntentBits.Guilds,
    ],
});

const app: Application = express();
app.set('discordClient', client);

const limiter = rateLimit({
    windowMs: config.limiterWindowMs,
	max: config.limiterMax,
	standardHeaders: true,
	legacyHeaders: false,
	message: config.limiterMessage
})

app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			...helmet.contentSecurityPolicy.getDefaultDirectives(),
			"img-src": ["'self'"],
			'media-src': ["'self'"],
			"default-src": ["'self'"]
		},
	}
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
app.use(cors({ origin: [`http://localhost:${config.appPort}`] }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(resolve(__dirname, '../client/build')))
app.use(express.json())

app.use('/api/v1/auth', authRouter)

app.use('/api/*', (req: Request, res: Response, next: NextFunction): void => {
	throw new NotFoundError('Route does not exist.')
})

app.get('/*', (req: Request, res: Response): void => {
	res.status(200).sendFile(resolve(__dirname, '../client/build/index.html'))
})

app.use((err: CustomError, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.message)
    res.status(err.statusCode || 500).send(err.message)
})

connectDB()
app.listen(config.appPort, (): void => console.log(`listening on port ${config.appPort}...`));