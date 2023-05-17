import { InternalServerError } from "../../errors"
import { getWishlist } from "../../utils/steam"
import { infoEmbed } from "../../utils/embeds"
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    Events
} from "discord.js"

export default {
	name: Events.InteractionCreate,
	once: false,
    execute: async (interaction: ButtonInteraction) => {
        if (!interaction.isButton()) {
            return
        }

        interface wishlistData {
            page: number
            steamID: string
            free: boolean | null
            reviews: string | null
        }

        const { type, data }: CustomID<wishlistData> = JSON.parse(interaction.customId)
        const { page, steamID, free, reviews } = data

        if (type !== 'wishlist') {
            return
        }

        if (!Number.isInteger(page) || !steamID) {
            throw new InternalServerError('The server messed up this button.')
        }

        let wishlistItems = await getWishlist(steamID, page)

        if (!wishlistItems?.length) {
            return interaction.reply({
                embeds: [infoEmbed('No more items in wishlist.')],
                ephemeral: true
            })
        }

        if (free !== null) {
            wishlistItems = wishlistItems.filter((item): boolean => Boolean(item.is_free_game) === free)
        }

        if (reviews) {
            wishlistItems = wishlistItems.filter((item): boolean => item.review_desc === reviews)
        }

        const wishlistEmbeds = wishlistItems.map((item): EmbedBuilder => {
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

        if (!wishlistEmbeds.length) {
            return interaction.reply({
                embeds: [infoEmbed('No more items in wishlist.')],
                ephemeral: true
            })
        }

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
                    steamID: steamID,
                    page: page + 1,
                    free: free,
                    reviews: reviews
                }
            }))
            .setStyle(ButtonStyle.Primary)
        )

        interaction.followUp({ components: [row], ephemeral: true })
    }
}