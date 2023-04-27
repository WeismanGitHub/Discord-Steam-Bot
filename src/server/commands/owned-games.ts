import { BadGatewayError, BadRequestError, InternalServerError } from '../errors';
import { titleEmbed } from '../utils/embeds';
import { UserModel } from '../db/models';
import { Config } from '../../config';
import axios, * as _ from 'axios'
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
        .addStringOption(option => option
            .setName('played_free_games')
            .setDescription("Include or exclude a user's played free games.")
            .addChoices(
                { name: 'include', value: 'true' },
                { name: 'exclude', value: 'false' },
            )
        )
	,
	async execute(interaction: ChatInputCommandInteraction) {
        const playedFreeGamesOption = interaction.options.getString('played_free_games')
        const user: User = interaction.options.getUser('user')!

        if (user.bot) {
            throw new BadRequestError('User is a bot.')
        }
        
        const steamID = (await UserModel.findById(user.id).select('-_id steamID').lean())?.steamID

        if (!steamID) {
            throw new BadRequestError('User is not in database.')
        }

        interface res {
            game_count: number | undefined
            games: ownedGame[] | undefined
        }

        const res: res = (await axios.get(
            `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/
            ?key=${Config.steamAPIKey}
            &steamid=${steamID}
            &include_appinfo=true
            ${playedFreeGamesOption !== null ? `&include_played_free_games=${playedFreeGamesOption}` : ''}`
        )
        .catch((err: Error) => {
            throw new BadGatewayError('Error getting owned games.')
        })).data?.response

        const gameCount = res.game_count
        const ownedGames= res.games

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

        if (!ownedGamesEmbeds.length) {
            throw new BadRequestError('No wishlist items found.')
        }

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
