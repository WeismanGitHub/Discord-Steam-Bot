import { BadGatewayError, BadRequestError, InternalServerError } from '../errors';
import { getPlayerSummaries, getSteamLevel } from '../utils/steam';
import { playerProfileEmbed, basicEmbed } from '../utils/embeds';
import { UserModel } from '../db/models';
import {
    SlashCommandBuilder,
    CommandInteraction,
    User,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
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
	async execute(interaction: CommandInteraction) {
        const user: User = interaction.options.getUser('user')!
        
        if (user.bot) {
            throw new BadRequestError('User is a bot.')
        }
        
        const userDoc = await UserModel.findById(user.id).select('-_id steamID role').lean()
        const steamID = userDoc?.steamID

        if (!userDoc || !steamID) {
            return interaction.reply({
                embeds: [basicEmbed('User is not in database.')],
                ephemeral: true
            })
        }

        if (userDoc.role === 'banned') {
            return interaction.reply({
                embeds: [basicEmbed('User is banned.')],
                ephemeral: true
            })
        }

        const results = await Promise.all([
            getPlayerSummaries(steamID),
            getSteamLevel(steamID)
        ])
        .catch((err: Error): void => {
            throw new BadGatewayError('Could not get user data.')
        })

        const playerData = results?.[0]?.[0]
        const playerLevel = results?.[1]
        
        if (!playerData || playerLevel === undefined) {
            throw new InternalServerError('Could not get user data.')
        }

        const embed = playerProfileEmbed(playerData)
        .addFields({
            inline: true,
            name: 'Level:',
            value: String(playerLevel)
        })

        const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents([
			new ButtonBuilder()
			.setLabel('profile')
			.setURL(playerData.profileurl)
			.setStyle(ButtonStyle.Link)
		])
		.addComponents([
			new ButtonBuilder()
			.setLabel('wishlist')
            .setCustomId(JSON.stringify({
                type: 'wishlist',
                data: {
                    steamID: steamID,
                    page: 0,
                    free: null,
                    reviews: null,
                }
            }))
			.setStyle(ButtonStyle.Primary)
		])
		.addComponents([
			new ButtonBuilder()
			.setLabel('games')
            .setCustomId(JSON.stringify({
                type: 'owned-games',
                data: {
                    steamID: steamID
                }
            }))
			.setStyle(ButtonStyle.Primary)
		])

		interaction.reply({
			embeds: [embed],
			components: [row],
			ephemeral: true
		})
	},
};
