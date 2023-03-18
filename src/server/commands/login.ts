import { SlashCommandBuilder, Interaction } from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('login')
		.setDescription('Connect your Steam account to this Discord Bot.')
	,
	async execute(interaction: Interaction): Promise<void> {
        console.log(interaction.user)
	},
};
