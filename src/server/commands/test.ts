import { SlashCommandBuilder, Interaction } from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('test command')
	,
	async execute(interaction: Interaction): Promise<void> {
        console.log(interaction)
	},
};
