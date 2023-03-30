import InternalServerError from '../errors/internal-server'
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
		const oauthURL: string | undefined = process.env.DISCORD_OAUTH_URL

		if (!oauthURL) {
			throw new InternalServerError('OAuth URL is undefined.')
		}

		const row = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
			.setLabel('Authorization Link')
			.setURL(oauthURL)
			.setStyle(ButtonStyle.Link),
		])
	
		const embed: EmbedBuilder = new EmbedBuilder()
		.setColor('#8F00FF') // Purple
		.setDescription("Click the link to allow this bot to save your Steam connection. Use the unauthorize command to remove the connection.")
		.addFields({ name: 'Contact the Creator:', value: `<@${process.env.MAIN_ACCOUNT_ID}>` })
	
		interaction.reply({
			embeds: [embed],
			components: [row],
			ephemeral: true
		})
	}
}
