import { SlashCommandBuilder, ChatInputCommandInteraction, User, Role, APIRole } from 'discord.js'
import { BadRequestError } from '../errors';

export default {
	data: new SlashCommandBuilder()
		.setName('level')
		.setDescription("Get the Steam level of a user or all user's with a role.")
        .setDMPermission(false)
        .addUserOption(option => option
            .setDescription("The user you want to target.")
            .setName('user')
        )
        .addRoleOption(option => option
            .setDescription("The role you want to target.")
            .setName('role')
        )
	,
	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const role: Role | APIRole | null = interaction.options.getRole('role')
        const user: User | null = interaction.options.getUser('user')

        if ((!role && !user) || (role && user)) {
            throw new BadRequestError('Choose a role or a user.')
        }
	},
};
