import { SlashCommandBuilder, CommandInteraction, User } from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('wishlist')
		.setDescription("Get someone's Steam wish list.")
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
