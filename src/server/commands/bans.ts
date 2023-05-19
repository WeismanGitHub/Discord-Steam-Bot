import { SlashCommandBuilder, ChatInputCommandInteraction, User } from 'discord.js'
import { infoEmbed, playerBansEmbed } from '../utils/embeds';
import { getPlayerBans } from '../utils/steam';
import { BadRequestError } from '../errors';
import { UserModel } from '../db/models';

export default {
	data: new SlashCommandBuilder()
		.setName('bans')
		.setDescription("Get someone's bans.")
        .setDMPermission(false)
        .addUserOption(option => option
            .setName('user')
            .setDescription("The user you want to target.")
            .setRequired(true)
        )
	,
	async execute(interaction: ChatInputCommandInteraction) {
        const user: User = interaction.options.getUser('user')!
        
        if (user.bot) {
            throw new BadRequestError('User is a bot.')
        }
        
        const userDoc = await UserModel.findById(user.id).select('-_id steamID role').lean()
        const steamID = userDoc?.steamID

        if (!userDoc || !steamID) {
            return interaction.reply({
                embeds: [infoEmbed('User is not in database.')],
                ephemeral: true
            })
        }

        if (userDoc.role === 'banned') {
            return interaction.reply({
                embeds: [infoEmbed('User is banned.')],
                ephemeral: true
            })
        }

        const bansData = await getPlayerBans(steamID)

        if (!bansData) {
            return interaction.reply({
                embeds: [infoEmbed('Ban data could not be fetched.')],
                ephemeral: true
            })
        }

        interaction.reply({ embeds: [playerBansEmbed(bansData)], ephemeral: true })
    },
};