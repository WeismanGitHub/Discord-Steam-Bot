import { InternalServerError } from "../../errors"
import { infoEmbed } from "../../utils/embeds"
import { formatDate } from "../../utils/misc"
import { PostModel } from "../../db/models"
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

        const { type, data }: CustomID<{ page: number }> = JSON.parse(interaction.customId)
        const { page } = data

        if (type !== 'posts') {
            return
        }

        const posts = await PostModel.find({}).lean().skip(page * 10).limit(10)
        .catch(err => {
            throw new InternalServerError('Could not get posts.')
        })

        if (!posts.length) {
            return interaction.reply({
                embeds: [infoEmbed('No posts.')],
                ephemeral: true
            })
        }

        const postEmbeds = posts.map((post) => infoEmbed(post.title, post.text, formatDate(post.createdAt)))

        const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents([
			new ButtonBuilder()
			.setLabel('Next Page ⏩')
            .setCustomId(JSON.stringify({ type: 'post', data: { page: page + 1 } }))
			.setStyle(ButtonStyle.Primary)
		])

        interaction.reply({
            embeds: postEmbeds,
            components: posts.length === 10 ? [row] : [],
            ephemeral: true,
        })
    }
}