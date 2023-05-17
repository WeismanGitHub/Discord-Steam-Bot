import { infoEmbed, wishlistGameEmbed } from '../utils/embeds';
import { getWishlist } from '../utils/steam';
import { BadRequestError } from '../errors';
import { UserModel } from '../db/models';
import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    User,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('wishlist')
		.setDescription("Get someone's Steam wish list.")
        .setDMPermission(false)
        .addUserOption(option => option
            .setName('user')
            .setDescription("The user you want to target.")
            .setRequired(true)
        )
        .addBooleanOption(option => option
            .setName('free')
            .setDescription("Filter by if it's free or not.")
        )
        .addStringOption(option => option
            .setName('reviews')
            .setDescription("Filter by reviews.")
            .addChoices(
                { name: 'Overwhelmingly Positive', value: 'Overwhelmingly Positive'},
                { name: 'Very Positive', value: 'Very Positive'},
                { name: 'Positive', value: 'Positive'},
                { name: 'Mostly Positive', value: 'Mostly Positive'},
                { name: 'Mixed', value: 'Mixed'},
                { name: 'Mostly Negative', value: 'Mostly Negative'},
                { name: 'Negative', value: 'Negative'},
                { name: 'Very Negative', value: 'Very Negative'},
                { name: 'Overwhelmingly Negative', value: 'Overwhelmingly Negative'},
                { name: 'No User Reviews', value: 'No user reviews'},
            )
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

        let wishlistGames = await getWishlist(steamID, 0)

        if (!wishlistGames?.length) {
            return interaction.reply({
                embeds: [infoEmbed('User has empty wishlist.')],
                ephemeral: true
            })
        }

        const reviewsOption = interaction.options.getString('reviews')
        const freeOption = interaction.options.getBoolean('free')

        if (freeOption !== null) {
            wishlistGames = wishlistGames.filter((item): boolean => Boolean(item.is_free_game) === freeOption)
        }

        if (reviewsOption) {
            wishlistGames = wishlistGames.filter((item): boolean => item.review_desc === reviewsOption)
        }

        const wishlistEmbeds = wishlistGames.map((game) => wishlistGameEmbed(game))
        const embedGroups = [];

        while (wishlistEmbeds.length > 0) {
            embedGroups.push(wishlistEmbeds.splice(0, 10))
        }

        await interaction.reply({ embeds: embedGroups[0], ephemeral: true })

        await Promise.all(embedGroups.slice(1).map((embedGroup) => interaction.followUp({ embeds: embedGroup, ephemeral: true })))

        const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
            .setLabel(`Next Page ⏩`)
            .setCustomId(JSON.stringify({
                type: 'wishlist',
                data: {
                    page: 0,
                    steamID: steamID,
                    free: freeOption,
                    reviews: reviewsOption
                }
            }))
            .setStyle(ButtonStyle.Primary)
        )

        interaction.followUp({ components: [row], ephemeral: true })
    },
};