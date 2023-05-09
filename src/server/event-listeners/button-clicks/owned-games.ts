import { ButtonInteraction, EmbedBuilder, Events } from "discord.js"
import { InternalServerError, BadRequestError } from "../../errors"
import { getOwnedGames } from "../../utils/steam"
import { infoEmbed } from "../../utils/embeds"

export default {
	name: Events.InteractionCreate,
	once: false,
    execute: async (interaction: ButtonInteraction) => {
        if (!interaction.isButton()) {
            return
        }

        interface ownedGamesData {
            steamID: string
        }

        const { type, data }: CustomID<ownedGamesData> = JSON.parse(interaction.customId)
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

        const ownedGamesEmbeds: EmbedBuilder[] = ownedGames.map((game): EmbedBuilder => {
            return new EmbedBuilder()
            .setTitle(game.name || 'unknown')
            .setColor('#8F00FF') // Purple
            .setImage(
                game.appid && game.img_icon_url ? `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg` : null
            )
            .addFields({
                name: 'Play Time:',
                value: ((): string => {
                    if (game.playtime_forever === undefined) return 'unknown'
    
                    const playTime = String(game.playtime_forever)
                    
                    if (playTime.length === 1) return `0.0${playTime} hours`
                    if (playTime.length === 2) return `0.${playTime} hours`
    
                    const position = String(playTime).length - 2;
                    const formattedPlaytime = [playTime.slice(0, position), '.', playTime.slice(position)].join('');
                    return `${formattedPlaytime} hours`
                })(),
            })
        })

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