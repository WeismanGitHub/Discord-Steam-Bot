import {
    Client,
    Collection,
    REST,
    Routes,
    ClientOptions,
    ActivityType,
    Presence
} from 'discord.js';

import { readdirSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';
dotenv.config();

export class CustomClient extends Client {
    constructor(clientOptions: ClientOptions) {
        super(clientOptions);

        this.token = String(process.env.TOKEN)
        this.commands = new Collection()
        
        this.login(this.token)
        .then((res) => {
            this.loadCommands()
        })
    }
    
    private loadCommands() {
        const commandsPath = join(__dirname, 'commands')
        const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        const commands = [];

        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);

            commands.push(command.default.data.toJSON());
            this.commands.set(command.default.data.name, command.default);
        }

        const rest = new REST({ version: '10' }).setToken(this.token);

        (async () => {
            try {
                console.log(`Started refreshing ${commands.length} application (/) commands.`);
                const clientId = this?.application?.id

                if (!clientId) {
                    throw new Error('Client Id is invalid.')
                }

                await rest.put(
                    Routes.applicationCommands(clientId),
                    { body: commands },
                );

                console.log(`Successfully reloaded ${commands.length} application (/) commands.`);
            } catch (err) {
                console.error(err);
            }
        })();

        this.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;
        
            const command = this.commands.get(interaction.commandName);
        
            if (!command) return;
        
            try {
                await command.execute(interaction);
            } catch (err) {
                console.error(err);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        });
    }

    public setPresence(
        type: Exclude<ActivityType, ActivityType.Custom>,
        name: string,
        url?: string
    ): Presence | undefined {
        return this.user?.setPresence({
            activities: [{
                type,
                name,
                url,
            },],
        });
    }

    commands: Collection<unknown, any>;
    token: string;
}