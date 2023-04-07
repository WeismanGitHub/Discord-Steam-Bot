import {
    Client,
    Collection,
    REST,
    Routes,
    ClientOptions,
    ActivityType,
    Presence,
    EmbedBuilder
} from 'discord.js';

import { CustomError } from './errors';
import { config } from '../config';
import { readdirSync } from 'fs';
import { join } from 'path';

export class CustomClient extends Client {
    constructor(clientOptions: ClientOptions) {
        super(clientOptions);

        this.token = config.discordToken!
        this.commands = new Collection()
        
        this.login(this.token)
        .then(async () => {
            await this.deleteCommands()
            this.loadCommands()
        })
    }
    
    private async deleteCommands() {
        try {
            const rest = new REST({ version: '10' }).setToken(this.token);

            await rest.put(Routes.applicationCommands(config.discordClientID!), { body: [] })

            console.log('deleted all commands...')
        } catch (err) {
            console.error(err);
        }
    }
    
    private async loadCommands() {
        try {
            const commandsPath = join(__dirname, 'commands')
            const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            const commands = [];

            for (const file of commandFiles) {
                const command = require(`./commands/${file}`);

                commands.push(command.default.data.toJSON());
                this.commands.set(command.default.data.name, command.default);
            }

            const rest = new REST({ version: '10' }).setToken(this.token);

            await rest.put(
                Routes.applicationCommands(config.discordClientID!),
                { body: commands },
            );

            console.log(`reloaded ${commands.length} commands...`);
        } catch (err) {
            console.error(err);
        }

        this.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;
        
            const command = this.commands.get(interaction.commandName);
        
            if (!command) return;
        
            try {
                await command.execute(interaction);
            } catch (err) {
                console.error(err);

                const embed: EmbedBuilder = new EmbedBuilder()
                .setTitle("There's been an error!")
                .setColor('#FF0000')

                if (err instanceof CustomError) {
                    embed.setDescription(err.message)
                    interaction.reply({ embeds: [embed], ephemeral: true });
                } else {
                    interaction.reply({ embeds: [embed], ephemeral: true });
                }
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