import { titleEmbed } from '../utils/embeds';
import { getWishlist } from '../utils/steam';
import { BadRequestError } from '../errors';
import { UserModel } from '../db/models';
import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    User,
    EmbedBuilder,
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
        
        const userDoc = await UserModel.findById(user.id).select('-_id steamID type').lean()
        const steamID = userDoc?.steamID

        if (!userDoc || !steamID) {
            return titleEmbed('User is not in database.')
        }

        if (userDoc.type === 'banned') {
            return titleEmbed('User is banned.')
        }

        let wishlistItems = await getWishlist(steamID, 0)

        if (!wishlistItems?.length) {
            return titleEmbed('User has empty wishlist.')
        }

        const reviewsOption = interaction.options.getString('reviews')
        const freeOption = interaction.options.getBoolean('free')

        if (freeOption !== null) {
            wishlistItems = wishlistItems.filter((item): boolean => Boolean(item.is_free_game) === freeOption)
        }

        if (reviewsOption) {
            wishlistItems = wishlistItems.filter((item): boolean => item.review_desc === reviewsOption)
        }

        const wishlistEmbeds: EmbedBuilder[] = wishlistItems.map((item): EmbedBuilder => {
            return new EmbedBuilder()
            .setTitle(item.name || 'Missing Title')
            .setImage(item.capsule || item.background || null)
            .setFooter({ text: `Release: ${item.release_string || 'unknown'}` })
            .setColor('#8F00FF') // Purple
            .addFields({
                name: 'Reviews:',
                value: item.reviews_percent ? `${item.reviews_percent}% positive` : 'unknown',
                inline: false
            })
            .addFields({
                name: 'Free:',
                value: String(Boolean(item.is_free_game)),
                inline: false
            })
            .addFields({
                name: 'Tags:',
                value: item.tags ? item.tags.join(', ') : 'none',
                inline: false
            })
        })

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