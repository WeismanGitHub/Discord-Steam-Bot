import { InternalServerError } from '../errors';
import { infoEmbed } from '../utils/embeds';
import { formatDate } from '../utils/misc';
import { PostModel } from '../db/models';
import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('posts')
		.setDescription("Get all posts.")
	,
	async execute(interaction: ChatInputCommandInteraction) {
        const posts = await PostModel.find({}).lean().limit(10)
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
            .setCustomId(JSON.stringify({ type: 'post', data: { page: 0 } }))
			.setStyle(ButtonStyle.Primary)
		])

        interaction.reply({
            embeds: postEmbeds,
            components: posts.length === 10 ? [row] : [],
            ephemeral: true,
        })
	},
};
