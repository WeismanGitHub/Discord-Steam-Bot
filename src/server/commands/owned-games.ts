import { BadRequestError, InternalServerError } from '../errors';
import { titleEmbed } from '../utils/embeds';
import { UserModel } from '../db/models';
import { config } from '../../config';
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
        const playedFreeGamesParam = playedFreeGamesOption !== null ? `&include_played_free_games=${playedFreeGamesOption}` : ''

        const steamID = (await UserModel.findById(user.id).select('-_id steamID').lean())?.steamID

        if (!steamID) {
            throw new BadRequestError('User is not in database.')
        }

        interface res {
            game_count: number | undefined
            games: playedGame[] | undefined
        }

        const res: res = ((await axios.get(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${config.steamAPIKey}&steamid=${steamID}${playedFreeGamesParam}&include_appinfo=true`)).data?.response)
        .catch((err: Error) => {
            throw new InternalServerError('Error getting wishlist.')
        })

        const playedGames= res.games
        const gameCount = res.game_count

        if (!playedGames) {
            throw new InternalServerError('Could not get played games.')
        }

        if (!playedGames.length) {
            return interaction.reply({
                embeds: [titleEmbed('No played games.')],
                ephemeral: true
            })
        }

        const playedGamesEmbeds: EmbedBuilder[] = playedGames.map((game): EmbedBuilder => {
            return new EmbedBuilder()
            .setTitle(game.name || 'unknown')
            // .setTitle(item.name || 'Missing Title')
            // .setImage(item.capsule || item.background || null)
            // .setFooter({ text: `Release: ${item.release_string || 'unknown'}` })
            // .setColor('#8F00FF') // Purple
            // .addFields({
            //     name: 'Reviews:',
            //     value: item.reviews_percent ? `${item.reviews_percent}% positive` : 'unknown',
            //     inline: false
            // })
            // .addFields({
            //     name: 'Free:',
            //     value: String(Boolean(item.is_free_game)),
            //     inline: false
            // })
            // .addFields({
            //     name: 'Tags:',
            //     value: item.tags ? item.tags.join(', ') : 'none',
            //     inline: false
            // })
        })

        if (!playedGamesEmbeds.length) {
            throw new BadRequestError('No wishlist items found.')
        }

        const embedGroups = [];

        while (playedGamesEmbeds.length > 0) {
            embedGroups.push(playedGamesEmbeds.splice(0, 10))
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
