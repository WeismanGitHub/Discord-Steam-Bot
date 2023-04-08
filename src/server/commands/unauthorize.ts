import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js'
import { BadRequestError, InternalServerError } from '../errors';
import { UserModel } from '../db/models';

export default {
	data: new SlashCommandBuilder()
		.setName('unauthorize')
		.setDescription('Delete all your stored data.')
	,
	async execute(interaction: CommandInteraction): Promise<void> {
		const res = await UserModel.deleteOne({ _id: interaction.user.id })
		.catch(err => { throw new InternalServerError('Could not delete your data.') })

		if (!res.deletedCount) {
			throw new BadRequestError("Nothing was changed. Maybe this bot already wasn't authorized?")
		}

		interaction.reply({ embeds: [
			new EmbedBuilder()
            .setTitle('Your data has been deleted!')
            .setColor('#8F00FF') // Purple
		]})
	}
}
