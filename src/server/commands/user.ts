import { SlashCommandBuilder, CommandInteraction, User } from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription("Get information about a user.")
        .setDMPermission(false)
        .addUserOption(option => option
            .setDescription("The user you want to target.")
            .setName('user')
            .setRequired(true)
        )
	,
	async execute(interaction: CommandInteraction): Promise<void> {
        const user: User = interaction.options.getUser('user')!
        console.log(user)
	},
};
