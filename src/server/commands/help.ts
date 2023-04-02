import {
	SlashCommandBuilder,
	CommandInteraction,
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription("Information about this bot.")
	,
	async execute(interaction: CommandInteraction): Promise<void> {
	}
}
