import { infoEmbed, playerBansEmbed } from "../../utils/embeds"
import { ButtonInteraction, Events } from "discord.js"
import { getPlayerBans } from "../../utils/steam"

export default {
	name: Events.InteractionCreate,
	once: false,
    execute: async (interaction: ButtonInteraction) => {
        if (!interaction.isButton()) {
            return
        }

        const { type, data }: CustomID<{ steamID: string }> = JSON.parse(interaction.customId)
        const { steamID } = data

        if (type !== 'bans') {
            return
        }

        const bansData = await getPlayerBans(steamID)

        if (!bansData) {
            return interaction.reply({
                embeds: [infoEmbed('Ban data could not be fetched.')],
                ephemeral: true
            })
        }

        interaction.reply({ embeds: [playerBansEmbed(bansData)], ephemeral: true })
    }
}