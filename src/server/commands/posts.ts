import { InternalServerError } from '../errors';
import { infoEmbed } from '../utils/embeds';
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

        // add date footer
        const postEmbeds = posts.map((post) => infoEmbed(post.title, post.text))

        const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents([
			new ButtonBuilder()
			.setLabel('Next Page ⏩')
            .setCustomId(JSON.stringify({ type: 'post', data: {} }))
			.setStyle(ButtonStyle.Primary)
		])

        interaction.reply({
            embeds: postEmbeds,
            components: [row],
            ephemeral: true,
        })
	},
};
