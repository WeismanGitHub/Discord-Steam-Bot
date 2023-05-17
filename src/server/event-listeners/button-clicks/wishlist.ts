import { InternalServerError } from "../../errors"
import { getWishlist } from "../../utils/steam"
import { infoEmbed, wishlistGameEmbed } from "../../utils/embeds"
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
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

        let wishlistGames = await getWishlist(steamID, page)

        if (!wishlistGames?.length) {
            return interaction.reply({
                embeds: [infoEmbed('No more items in wishlist.')],
                ephemeral: true
            })
        }

        if (free !== null) {
            wishlistGames = wishlistGames.filter((item): boolean => Boolean(item.is_free_game) === free)
        }

        if (reviews) {
            wishlistGames = wishlistGames.filter((item): boolean => item.review_desc === reviews)
        }

        const wishlistEmbeds = wishlistGames.map((game) => wishlistGameEmbed(game))

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