import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import { BadRequestError, InternalServerError } from '../errors';
import { UserModel } from '../db/models';
import { basicEmbed } from '../utils/embeds';

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

		interaction.reply({
			embeds: [basicEmbed('Your data has been deleted!')],
			ephemeral: true
		})
	}
}
