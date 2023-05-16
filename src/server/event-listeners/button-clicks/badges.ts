import { ButtonInteraction, EmbedBuilder, Events } from "discord.js"
import { infoEmbed, badgeEmbed } from "../../utils/embeds"
import { InternalServerError } from "../../errors"
import { getBadges } from "../../utils/steam"

export default {
	name: Events.InteractionCreate,
	once: false,
    execute: async (interaction: ButtonInteraction) => {
        if (!interaction.isButton()) {
            return
        }

        const { type, data }: CustomID<{ steamID: string }> = JSON.parse(interaction.customId)
        const { steamID } = data

        if (type !== 'badges') {
            return
        }

        const badges = await getBadges(steamID)

        if (!badges) {
            throw new InternalServerError('Could not get friends.')
        }
        
        if (!badges?.length) {
            return interaction.reply({
                embeds: [infoEmbed('User has no friends.')],
                ephemeral: true
            })
        }

        const badgesEmbeds = badges.map((badge): EmbedBuilder => badgeEmbed(badge))
        const embedGroups = [];

        while (badgesEmbeds.length > 0) {
            embedGroups.push(badgesEmbeds.splice(0, 10))
        }

        await interaction.reply({ embeds: embedGroups[0], ephemeral: true })

        await Promise.all(embedGroups.slice(1).map((embedGroup) => interaction.followUp({ embeds: embedGroup, ephemeral: true })))

        interaction.followUp({
            embeds: [infoEmbed(`Badges Count: ${badges.length ?? 'unknown'}`)],
            ephemeral: true
        })
    }
}
