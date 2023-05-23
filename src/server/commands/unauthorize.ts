import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import { BadRequestError, InternalServerError } from '../errors';
import { UserModel } from '../db/models';
import { infoEmbed } from '../utils/embeds';

export default {
	data: new SlashCommandBuilder()
		.setName('unauthorize')
		.setDescription('Delete all your stored data.')
	,
	async execute(interaction: CommandInteraction): Promise<void> {
		const res = await UserModel.deleteOne({ _id: interaction.user.id, role: { $ne: 'banned' } })
		.catch(err => { console.log(err);throw new InternalServerError('Could not delete your data.') })

		if (!res.deletedCount) {
			throw new BadRequestError("Nothing was deleted. If you have been banned, your data will be stored.")
		}

		interaction.reply({
			embeds: [infoEmbed('Your data has been deleted!')],
			ephemeral: true
		})
	}
}
