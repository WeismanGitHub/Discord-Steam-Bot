import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, EmbedBuilder, Events } from "discord.js"
import { InternalServerError } from "../../errors"
import axios, * as _ from 'axios'

export default {
	name: Events.InteractionCreate,
	once: false,
    execute: async (interaction: ButtonInteraction) => {
        if (!interaction.isButton()) {
            return
        }

        const { page, steamID, type, filters } = JSON.parse(interaction.customId)

        if (type !== 'wishlist') {
            return
        }

        if (!Number.isInteger(page) || !steamID) {
            throw new InternalServerError('The server messed up this button.')
        }

        const res = await axios.get(`https://store.steampowered.com/wishlist/profiles/${steamID}/wishlistdata/?p=${page + 1}`)
        .catch((err: Error) => {
            throw new InternalServerError('Error getting wishlist.')
        })

        if (!res?.data) {
            throw new InternalServerError('Error getting wishlist.')
        }

        let wishlistItems: wishlistItem[] = Object.values(res.data)

        if (!wishlistItems.length) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle('No more items in wishlist.')
                    .setColor('#8F00FF') // Purple
                ],
                ephemeral: true
            })
        }

        if (filters?.free !== null) {
            wishlistItems = wishlistItems.filter((item): boolean => Boolean(item.is_free_game) == filters?.free)
        }

        if (filters?.reviews) {
            wishlistItems = wishlistItems.filter((item): boolean => item.review_desc == filters?.reviews)
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

        if (!wishlistEmbeds.length) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle('No more items in wishlist.')
                    .setColor('#8F00FF') // Purple
                ],
                ephemeral: true
            })
        }

        const embedGroups = [];

        while (wishlistEmbeds.length > 0) {
            embedGroups.push(wishlistEmbeds.splice(0, 10))
        }

        if (interaction.channel?.type !== ChannelType.GuildText) {
            return
        }

        await interaction.reply({ embeds: embedGroups[0], ephemeral: true })

        await Promise.all(embedGroups.slice(1).map((embedGroup) => interaction.followUp({ embeds: embedGroup, ephemeral: true })))

        const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
            .setLabel(`Next Page ⏩`)
            .setCustomId(JSON.stringify({
                page: page + 1,
                steamID: steamID,
                type: 'wishlist',
                filters: {
                    free: filters?.free || null,
                    reviews: filters?.reviews || null
                }
            }))
            .setStyle(ButtonStyle.Primary)
        )

        interaction.followUp({ components: [row], ephemeral: true })
    }
}