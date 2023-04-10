import { BadRequestError, InternalServerError } from '../errors';
import { UserModel } from '../db/models';
import { config } from '../../config';
import axios, * as _ from 'axios'
import {
    SlashCommandBuilder,
    CommandInteraction,
    User,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription("Get information about a user.")
        .setDMPermission(false)
        .addUserOption(option => option
            .setDescription("The user you want to target.")
            .setName('user')
            .setRequired(true)
        )
	,
	async execute(interaction: CommandInteraction): Promise<void> {
        const user: User = interaction.options.getUser('user')!

        const steamID = (await UserModel.findById(user.id).select('-_id steamID').lean())?.steamID

        if (!steamID) {
            throw new BadRequestError('User is not in database.')
        }

        const playerData: player | undefined = (await axios.get(
            `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${config.steamAPIKey}&steamids=${steamID}`
        )
        .catch((err: Error): void => {
            throw new InternalServerError('Could not get user data.')
        }))?.data?.response?.players[0]
        
        if (!playerData) {
            throw new InternalServerError('Could not get user data.')
        }

        const birthday = new Date(Number(`${playerData.timecreated}000`))
        const formattedBirthday = birthday.toLocaleDateString("en-US", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })

        const embed = new EmbedBuilder()
        .setImage(playerData.avatarfull || null)
        .addFields({
            inline: true,
            name: 'Name:',
            value: playerData.personaname || 'unknown'
        })
        .addFields({
            inline: true,
            name: 'Account Birthday:',
            value: formattedBirthday
        })

        const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents([
			new ButtonBuilder()
			.setLabel('Profile')
			.setURL(playerData.profileurl)
			.setStyle(ButtonStyle.Link)
		])

		interaction.reply({
			embeds: [embed],
			components: [row],
			ephemeral: true
		})
	},
};
