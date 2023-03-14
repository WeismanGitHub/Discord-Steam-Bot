import { Client, GatewayIntentBits, Collection } from 'discord.js';
import express, { Application, Request, Response } from 'express';
import { readdirSync } from 'fs';
import dotenv from 'dotenv';
import { join } from 'path';
dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ],
});

const port: number = Number(process.env.PORT) || 5000;
const app: Application = express();
client.commands = new Collection();
app.set('discordClient', client);

const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = join(commandsPath, file);
	const command = require(filePath);

	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

app.get('/', (req: Request, res: Response): void => {
    res.status(200).send('hello world!');
})

client.on("ready", async (): Promise<void> => {
	client.user.setActivity('hello world!');

	console.log('bot is ready...');
});

app.listen(port, (): void => console.log(`listening on port ${port}...`));
client.login(process.env.TOKEN);