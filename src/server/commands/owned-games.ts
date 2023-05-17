import { SlashCommandBuilder, ChatInputCommandInteraction, User } from 'discord.js'
import { BadRequestError, InternalServerError } from '../errors';
import { infoEmbed, ownedGameEmbed } from '../utils/embeds';
import { getOwnedGames } from '../utils/steam';
import { UserModel } from '../db/models';

export default {
	data: new SlashCommandBuilder()
		.setName('owned_games')
		.setDescription("Get the owned games of a user")
        .setDMPermission(false)
        .addUserOption(option => option
            .setName('user')
            .setDescription("The user you want to target.")
            .setRequired(true)
        )
        .addBooleanOption(option => option
            .setName('include_played_free_games')
            .setDescription("Include or exclude a user's played free games.")
        )
	,
	async execute(interaction: ChatInputCommandInteraction) {
        const playedFreeGamesOption = interaction.options.getBoolean('include_played_free_games')
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

        const ownedGamesData = await getOwnedGames(userDoc.steamID, playedFreeGamesOption)
        const gameCount = ownedGamesData?.game_count
        const ownedGames= ownedGamesData?.games

        if (!ownedGames) {
            throw new InternalServerError('Could not get owned games.')
        }

        if (!ownedGames.length) {
            return interaction.reply({
                embeds: [infoEmbed('No owned games.')],
                ephemeral: true
            })
        }

        const ownedGamesEmbeds = ownedGames.map((game) => ownedGameEmbed(game))
        const embedGroups = [];

        while (ownedGamesEmbeds.length > 0) {
            embedGroups.push(ownedGamesEmbeds.splice(0, 10))
        }

        await interaction.reply({
            embeds: embedGroups[0],
            ephemeral: true
        })

        await Promise.all(embedGroups.slice(1).map((embedGroup) => interaction.followUp({ embeds: embedGroup, ephemeral: true })))

        interaction.followUp({
            embeds: [infoEmbed(`Game Count: ${gameCount ?? 'unknown'}`)],
            ephemeral: true
        })
	},
};
