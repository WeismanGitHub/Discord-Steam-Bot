import { config } from '../../config'
import {
	SlashCommandBuilder,
	CommandInteraction,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('authorize')
		.setDescription('Authorize this bot to see your connected Steam account.')
	,
	async execute(interaction: CommandInteraction): Promise<void> {

		const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents([
			new ButtonBuilder()
			.setLabel('Authorization Link')
			.setURL(config.redirectURI!)
			.setStyle(ButtonStyle.Link),
		])
	
		const embed: EmbedBuilder = new EmbedBuilder()
		.setColor('#8F00FF') // Purple
		.setDescription("Click the link to allow this bot to save your Steam connection. Use the `unauthorize` command to delete all your data stored by the bot.")
		.addFields({ name: 'Contact the Creator:', value: `<@${process.env.MAIN_ACCOUNT_ID}>` })
	
		interaction.reply({
			embeds: [embed],
			components: [row],
			ephemeral: true
		})
	}
}
