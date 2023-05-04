import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription("Create a ticket for anything you want to get through to the admins.")
	,
	async execute(interaction: ChatInputCommandInteraction) {
        const modal = new ModalBuilder()
        .setCustomId(JSON.stringify({ type: 'ticket', data: {} }))
        .setTitle('Create a Ticket');

        const titleInput = new TextInputBuilder()
        .setCustomId('title')
        .setLabel("Title")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(256)
        .setRequired(true)
        .setMinLength(1)

        const bodyInput = new TextInputBuilder()
        .setCustomId('body')
        .setLabel("Body")
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(1)
        .setRequired(true)

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput),
            new ActionRowBuilder<TextInputBuilder>().addComponents(bodyInput),
        );

        await interaction.showModal(modal);
	},
};
