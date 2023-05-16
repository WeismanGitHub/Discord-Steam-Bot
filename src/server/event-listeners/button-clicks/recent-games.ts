import { ButtonInteraction, EmbedBuilder, Events } from "discord.js"
import { infoEmbed, recentGameEmbed } from "../../utils/embeds"
import { getRecentlyPlayedGames } from "../../utils/steam"
import { InternalServerError } from "../../errors"

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

        const recentGamesData = await getRecentlyPlayedGames(steamID)
        const gameCount = recentGamesData?.total_count
        const recentGames= recentGamesData?.games

        if (!recentGamesData) {
            throw new InternalServerError('Could not get recently played games.')
        }
        
        if (!recentGames?.length) {
            return interaction.reply({
                embeds: [infoEmbed('User has no recently played games.')],
                ephemeral: true
            })
        }

        const recentGamesEmbeds: EmbedBuilder[] = recentGames.map((game) => recentGameEmbed(game))
        
        const embedGroups: EmbedBuilder[][] = [];

        while (recentGamesEmbeds.length > 0) {
            embedGroups.push(recentGamesEmbeds.splice(0, 10))
        }

        await interaction.reply({
            embeds: embedGroups[0],
            ephemeral: true
        })

        await Promise.all(embedGroups.slice(1).map((embedGroup) => interaction.followUp({ embeds: embedGroup, ephemeral: true })))

        interaction.followUp({
            embeds: [infoEmbed(`Recent Games Count: ${gameCount ?? 'unknown'}`)],
            ephemeral: true
        })
    }
}
