import { SlashCommandBuilder, ChatInputCommandInteraction, User } from 'discord.js'
import { BadRequestError, InternalServerError } from '../errors';
import { infoEmbed, recentGameEmbed } from '../utils/embeds';
import { getRecentlyPlayedGames } from '../utils/steam';
import { UserModel } from '../db/models';

export default {
	data: new SlashCommandBuilder()
		.setName('recent-games')
		.setDescription("Get someone's recently played games.")
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
        
        if (!userDoc) {
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

        const recentGamesData = await getRecentlyPlayedGames(userDoc.steamID)
        const gameCount = recentGamesData?.total_count
        const recentGames= recentGamesData?.games

        if (!recentGamesData) {
            throw new InternalServerError('Could not get recently played games.')
        }
        
        if (!recentGames?.length) {
            return interaction.reply({
                embeds: [infoEmbed('User has no recently played games.')],
                ephemeral: true
            })
        }

        const recentGamesEmbeds = recentGames.map((game) => recentGameEmbed(game))
        const embedGroups = [];

        while (recentGamesEmbeds.length > 0) {
            embedGroups.push(recentGamesEmbeds.splice(0, 10))
        }

        await interaction.reply({
            embeds: embedGroups[0],
            ephemeral: true
        })

        await Promise.all(embedGroups.slice(1).map((embedGroup) => interaction.followUp({ embeds: embedGroup, ephemeral: true })))

        interaction.followUp({
            embeds: [infoEmbed(`Recent Games Count: ${gameCount ?? 'unknown'}`)],
            ephemeral: true
        })
    },
};