import { ButtonInteraction, EmbedBuilder, Events } from "discord.js"
import { InternalServerError, BadRequestError } from "../../errors"
import { getOwnedGames } from "../../utils/steam"
import { infoEmbed, ownedGameEmbed } from "../../utils/embeds"

export default {
	name: Events.InteractionCreate,
	once: false,
    execute: async (interaction: ButtonInteraction) => {
        if (!interaction.isButton()) {
            return
        }

        const { type, data }: CustomID<{ steamID: string }> = JSON.parse(interaction.customId)
        const { steamID } = data

        if (type !== 'owned-games') {
            return
        }

        const ownedGamesData = await getOwnedGames(steamID, null)
        const gameCount = ownedGamesData?.game_count
        const ownedGames= ownedGamesData?.games

        if (!ownedGames) {
            throw new InternalServerError('Could not get owned games.')
        }

        if (!ownedGames.length) {
            return interaction.reply({
                embeds: [infoEmbed('No owned games.')],
                ephemeral: true
            })
        }

        const ownedGamesEmbeds: EmbedBuilder[] = ownedGames.map((game) => ownedGameEmbed(game))

        if (!ownedGamesEmbeds.length) {
            throw new BadRequestError('No owned games found.')
        }

        const embedGroups = [];

        while (ownedGamesEmbeds.length > 0) {
            embedGroups.push(ownedGamesEmbeds.splice(0, 10))
        }

        await interaction.reply({
            embeds: embedGroups[0],
            ephemeral: true
        })

        await Promise.all(embedGroups.slice(1).map((embedGroup) => interaction.followUp({ embeds: embedGroup, ephemeral: true })))

        interaction.followUp({
            embeds: [infoEmbed(`Game Count: ${gameCount ?? 'unknown'}`)],
            ephemeral: true
        })
    }
}