import { TicketModel } from "../../db/models";
import {
    Events,
    ModalSubmitInteraction
} from "discord.js"
import { titleEmbed } from "../../utils/embeds";

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

        interaction.reply({ embeds: [titleEmbed('A ticket has been created.')] })
    }
}