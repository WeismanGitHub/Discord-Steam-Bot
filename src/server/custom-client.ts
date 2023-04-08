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

import { readdirSync, statSync } from 'fs';
import { CustomError } from './errors';
import { config } from '../config';
import { join } from 'path';

function getPaths(dir: string): string[] {
    const paths = readdirSync(dir)
    const filePaths: string[] = []

    function recursiveLoop(paths: string[]) {
        for (let path of paths) {
            const fileStat = statSync(path)
            
            if (fileStat.isFile()) {
                filePaths.push(path)
            } else if (fileStat.isDirectory()) {
                recursiveLoop(readdirSync(path).map(subPath => join(path, subPath)))
            }
        }
    }
    
    recursiveLoop(paths.map(path => join(dir, path)))
    
    return filePaths
}

export class CustomClient extends Client {
    constructor(clientOptions: ClientOptions) {
        super(clientOptions);

        this.token = config.discordToken!
        this.commands = new Collection()
        
        this.login(this.token)
        .then(async () => {
            this.loadEventListeners()
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
            const commandsPaths: string[] = getPaths(join(__dirname, 'commands')).filter(file => file.endsWith('.js'))
            const commands = [];

            for (const path of commandsPaths) {
                const command = require(path);
        
                if (!command.default.data) {
                    console.log(`malformed command file...`)
                    continue
                }
        
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

    private async loadEventListeners() {
        const eventsPaths = getPaths(join(__dirname, 'event-listeners')).filter(file => file.endsWith('.js'))
        
        for (const eventPath of eventsPaths) {
            const event = require(eventPath);

            this.on(event.name, (...args) => {
                event.execute(...args)
                .catch((err: Error) => {
                    if (event.name == 'interactionCreate') {
                        const interaction = args[0]
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
                })
            });
        }
    
        console.log(`loaded ${eventsPaths.length} event listeners...`);
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