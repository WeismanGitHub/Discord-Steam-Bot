import { ModalSubmitInteraction, Events } from "discord.js";

export default {
	name: Events.InteractionCreate,
	once: true,
	execute(interaction: ModalSubmitInteraction) {
        if (!interaction.isModalSubmit()) return;

        const { type }: CustomID<{}> = JSON.parse(interaction.customId)

        if (type !== 'ticket')
            return

        console.log(interaction)
	},
};
