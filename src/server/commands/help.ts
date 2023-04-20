import { Config } from '../../config'
import {
	SlashCommandBuilder,
	CommandInteraction,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription("Information about this bot.")
	,
	async execute(interaction: CommandInteraction): Promise<void> {
		const embed: EmbedBuilder = new EmbedBuilder()
		.setColor('#8F00FF') // Purple
		.setDescription("Click the link to allow this bot to save your Steam connection. Use the `/unauthorize` command to delete all your data stored by the bot.")
		.addFields({ name: 'Contact the Creator:', value: `<@${Config.mainAccountID}>` })
	
		const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents([
			new ButtonBuilder()
			.setLabel('Authorization')
			.setURL(Config.authRedirectURI!)
			.setStyle(ButtonStyle.Link),
			new ButtonBuilder()
			.setLabel('Source Code')
			.setURL(Config.sourceCodeLink!)
			.setStyle(ButtonStyle.Link),
			new ButtonBuilder()
			.setLabel('Buy Me a Coffee')
			.setURL(Config.buyMeACofeeLink!)
			.setStyle(ButtonStyle.Link),
		])

		interaction.reply({
			embeds: [embed],
			components: [row],
			ephemeral: true
		})
	}
}
