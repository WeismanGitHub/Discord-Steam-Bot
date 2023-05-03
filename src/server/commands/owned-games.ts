import { BadRequestError, InternalServerError } from '../errors';
import { getOwnedGames } from '../utils/steam';
import { titleEmbed } from '../utils/embeds';
import { UserModel } from '../db/models';
import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    User,
    EmbedBuilder
} from 'discord.js'

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

        const userDoc = await UserModel.findById(user.id).select('-_id steamID type').lean()

        if (!userDoc) {
            return titleEmbed('User is not in database.')
        }

        if (userDoc.type === 'banned') {
            return titleEmbed('User is banned.')
        }

        const ownedGamesData = await getOwnedGames(userDoc.steamID, playedFreeGamesOption)
        const gameCount = ownedGamesData?.game_count
        const ownedGames= ownedGamesData?.games

        if (!ownedGames) {
            throw new InternalServerError('Could not get owned games.')
        }

        if (!ownedGames.length) {
            return interaction.reply({
                embeds: [titleEmbed('No owned games.')],
                ephemeral: true
            })
        }

        const ownedGamesEmbeds: EmbedBuilder[] = ownedGames.map((game): EmbedBuilder => {
            return new EmbedBuilder()
            .setTitle(game.name || 'unknown')
            .setColor('#8F00FF') // Purple
            .setImage(
                game.appid && game.img_icon_url ? `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg` : null
            )
            .addFields({
                name: 'Play Time:',
                value: ((): string => {
                    if (game.playtime_forever === undefined) return 'unknown'
    
                    const playTime = String(game.playtime_forever)
                    
                    if (playTime.length === 1) return `0.0${playTime} hours`
                    if (playTime.length === 2) return `0.${playTime} hours`
    
                    const position = String(playTime).length - 2;
                    const formattedPlaytime = [playTime.slice(0, position), '.', playTime.slice(position)].join('');
                    return `${formattedPlaytime} hours`
                })(),
            })
        })
        
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
            embeds: [titleEmbed(`Game Count: ${gameCount ?? 'unknown'}`)],
            ephemeral: true
        })
	},
};
