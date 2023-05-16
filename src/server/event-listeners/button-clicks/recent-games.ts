import { ButtonInteraction, Events } from "discord.js"
// import { infoEmbed, recentGameEmbed } from "../../utils/embeds"
// import { getRecentlyPlayedGames } from "../../utils/steam"
// import { InternalServerError } from "../../errors"

export default {
	name: Events.InteractionCreate,
	once: false,
    execute: async (interaction: ButtonInteraction) => {
        if (!interaction.isButton()) {
            return
        }

        const { type, data }: CustomID<{ steamID: string }> = JSON.parse(interaction.customId)
        const { steamID } = data

        if (type !== 'recent-games') {
            return
        }

        console.log(steamID)
    }
}
