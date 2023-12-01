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
		.setColor('#FF7B00') // orange
		.setDescription("Use slash commands to conveniently view other users' public Steam information. Allow access to view your connected Steam account through the link below so others can use commands on you. Use `/unauthorize` to delete all data stored by the bot.")
		.addFields({ name: 'Contact the Creator:', value: `<@${Config.mainAccountID}>` })
	
		const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents([
			new ButtonBuilder()
			.setLabel('Authorization')
			.setURL(Config.authRedirectURI)
			.setStyle(ButtonStyle.Link),
			new ButtonBuilder()
			.setLabel('Website')
			.setURL(Config.websiteLink)
			.setStyle(ButtonStyle.Link),
			new ButtonBuilder()
			.setLabel('Source Code')
			.setURL(Config.sourceCodeLink)
			.setStyle(ButtonStyle.Link),
			// new ButtonBuilder()
			// .setLabel('Buy Me a Coffee')
			// .setURL(Config.buyMeACoffeeLink)
			// .setStyle(ButtonStyle.Link),
		])

		interaction.reply({
			embeds: [embed],
			components: [row],
			ephemeral: true
		})
	}
}
