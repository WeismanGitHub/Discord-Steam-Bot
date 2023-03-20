import { SlashCommandBuilder, CommandInteraction, User } from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('wishlist')
		.setDescription("Get someone's Steam wish list.")
        .addUserOption(option => option
            .setName('user')
            .setRequired(true)
        )
	,
	async execute(interaction: CommandInteraction): Promise<void> {
        const user: User = interaction.options.getUser('user')!
        console.log(user)
	},
};
