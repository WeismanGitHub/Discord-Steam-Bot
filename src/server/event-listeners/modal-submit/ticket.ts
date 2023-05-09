import { Events, ModalSubmitInteraction } from "discord.js"
import { infoEmbed } from "../../utils/embeds";
import { TicketModel } from "../../db/models";

export default {
	name: Events.InteractionCreate,
	once: false,
    execute: async (interaction: ModalSubmitInteraction) => {
        if (!interaction.isModalSubmit()) return;

        const { type }: CustomID<{}> = JSON.parse(interaction.customId)

        if (type !== 'ticket') return

        const title = interaction.fields.getTextInputValue('text')
        const text = interaction.fields.getTextInputValue('title')

        await TicketModel.create({
            title,
            text,
            userID: interaction.user.id
        })

        interaction.reply({
            embeds: [infoEmbed('A ticket has been created.', 'You will be notified once it has been resolved.')],
            ephemeral: true
        })
    }
}