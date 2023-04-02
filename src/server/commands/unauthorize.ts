import {
	SlashCommandBuilder,
	CommandInteraction,
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('unauthorize')
		.setDescription('Delete all your data stored by this bot.')
	,
	async execute(interaction: CommandInteraction): Promise<void> {
	}
}
