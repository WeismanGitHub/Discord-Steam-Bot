import { BadGatewayError, BadRequestError, InternalServerError } from '../errors';
import { getPlayerSummaries, getSteamLevel } from '../utils/steam';
import { UserModel } from '../db/models';
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
        
        if (user.bot) {
            throw new BadRequestError('User is a bot.')
        }
        
        const steamID = (await UserModel.findById(user.id).select('-_id steamID').lean())?.steamID

        if (!steamID) {
            throw new BadRequestError('User is not in database.')
        }

        const results = await Promise.all([
            getPlayerSummaries(steamID),
            getSteamLevel(steamID)
        ])
        .catch((err: Error): void => {
            throw new BadGatewayError('Could not get user data.')
        })

        const playerData = results?.[0]
        const playerLevel = results?.[1]
        
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
            name: 'Level:',
            value: String(playerLevel)
        })
        .addFields({
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
