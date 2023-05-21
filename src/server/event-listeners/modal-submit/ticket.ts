import { infoEmbed } from "../../utils/embeds";
import { TicketModel } from "../../db/models";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events,
    ModalSubmitInteraction
} from "discord.js"
import { Config } from "../../../config";

export default {
	name: Events.InteractionCreate,
	once: false,
    execute: async (interaction: ModalSubmitInteraction) => {
        if (!interaction.isModalSubmit()) return;

        const { type }: CustomID<{}> = JSON.parse(interaction.customId)

        if (type !== 'ticket') return

        const title = interaction.fields.getTextInputValue('text')
        const text = interaction.fields.getTextInputValue('title')

        const ticket = await TicketModel.create({
            title,
            text,
            userID: interaction.user.id
        })

        const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents([
			new ButtonBuilder()
			.setLabel('View Your Ticket')
            .setURL(`${Config.websiteLink}tickets/${ticket.id}`)
			.setStyle(ButtonStyle.Link)
		])

        interaction.reply({
            embeds: [infoEmbed('A ticket has been created.', 'You will be notified once it has been resolved.')],
            components: [row],
            ephemeral: true
        })
    }
}