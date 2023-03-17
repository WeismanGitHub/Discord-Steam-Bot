import express, { Application, Request, Response } from 'express';
import { GatewayIntentBits } from 'discord.js';
import { CustomClient } from './custom-client';

const client: CustomClient = new CustomClient({
    intents: [
        GatewayIntentBits.Guilds,
    ],
});

const port: number = Number(process.env.PORT) || 5000;

const app: Application = express();
app.set('discordClient', client);

app.get('/', (req: Request, res: Response): void => {
    res.status(200).send('hello world!');
})

client.on('ready', () => {
	console.log('bot is ready...')
})

app.listen(port, (): void => console.log(`listening on port ${port}...`));