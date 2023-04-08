import { SlashCommandBuilder, ChatInputCommandInteraction, User } from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('overlap')
		.setDescription("Get the overlap between two users.")
        .setDMPermission(false)
        .addStringOption(option => option
            .setDescription("The type of overlap you want to find.")
            .setName('type')
            .setRequired(true)
            .addChoices(
                { name: 'games', value: 'games' },
                { name: 'wishlist', value: 'wishlist' },
                { name: 'friends', value: 'friends' },
            )
        )
        .addUserOption(option => option
            .setDescription("The first user you want to target.")
            .setName('user_1')
            .setRequired(true)
        )
        .addUserOption(option => option
            .setDescription("The second user you want to target.")
            .setName('user_1')
            .setRequired(true)
        )
	,
	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const user1: User = interaction.options.getUser('user_1')!
        const user2: User = interaction.options.getUser('user_2')!
        console.log(user1, user2)
	},
};
