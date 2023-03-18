import express, { Application, Request, Response } from 'express';
import { ActivityType, GatewayIntentBits } from 'discord.js';
import { CustomClient } from './custom-client';
import rateLimit from 'express-rate-limit'
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
const max = 15

const app: Application = express();
app.set('discordClient', client);

app.get('/', (req: Request, res: Response): void => {
    res.status(200).send('hello world!');
})

client.on('ready', () => {
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

app.use(limiter)
app.use(compression())
app.use(cors({ origin: ['http://localhost:5000'] }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.listen(port, (): void => console.log(`listening on port ${port}...`));