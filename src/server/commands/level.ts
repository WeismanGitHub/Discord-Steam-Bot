import { SlashCommandBuilder, ChatInputCommandInteraction, User } from 'discord.js'
import { errorEmbed, titleEmbed } from '../utils/embeds';
import { BadRequestError } from '../errors';
import { UserModel } from '../db/models';
const steamWeb = require('steam-web');
import { config } from '../../config';

export default {
	data: new SlashCommandBuilder()
		.setName('level')
		.setDescription("Get the Steam level of a user.")
        .setDMPermission(false)
        .addUserOption(option => option
            .setDescription("The user you want to target.")
            .setName('user')
            .setRequired(true)
        )
	,
	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const user: User = interaction.options.getUser('user')!

        const steamID = (await UserModel.findById(user.id).select('-_id steamID').lean())?.steamID

        if (!steamID) {
            throw new BadRequestError('User is not in database.')
        }

        const steam = new steamWeb({
            apiKey: config.steamAPIKey,
            format: 'json'
        });

        steam.getSteamLevel({
            steamid: steamID,
            callback: (err: Error, data: { response: { player_level: number } }) => {
                if (err) {
                    return interaction.reply({
                        embeds: [errorEmbed('Could not get level.')],
                        ephemeral: true
                    });
                }

                interaction.reply({
                    embeds: [titleEmbed(`Level: ${data.response.player_level}`)],
                    ephemeral: true
                })
            }
        })
	},
};
