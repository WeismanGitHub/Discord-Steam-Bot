import { formatSteamDate, formatSteamPlaytime } from "./misc";
import { EmbedBuilder } from "discord.js";

function errorEmbed(description: string | null = null, statusCode: number | null = null): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle("There's been an error!")
        .setDescription(`${description ?? ''}\nStatus Code: ${statusCode ?? 'Unknown'}`)
        .setColor('#FF0000') // Red
}

function infoEmbed(title: string, description: null | string = null, footer: null | string = null): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(title)
        .setColor('#8F00FF') // Purple
        .setDescription(description)
        .setFooter(footer ? { text: footer } : null)
}

function playerProfileEmbed(player: player): EmbedBuilder {
    return new EmbedBuilder()
        .setColor('#000EFF') // Blue
        .setImage(player.avatarfull || null)
        .addFields({
            inline: true,
            name: 'Name:',
            value: player.personaname || 'unknown'
        })
        .addFields({
            name: 'Account Birthday:',
            value: formatSteamDate(player.timecreated)
        })
}

function recentGameEmbed(game: recentlyPlayedGame): EmbedBuilder {
    return new EmbedBuilder()
        .setColor('#000EFF') // Blue
        .setTitle(game.name || 'unknown')
        .setImage(
            game.appid && game.img_icon_url ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg` : null
        )
        .addFields({
            name: 'Total Playtime:',
            value: game.playtime_forever ? formatSteamPlaytime(game.playtime_forever) : 'unknown',
        })
        .addFields({
            name: 'Past 2 Weeks Playtime:',
            value: game.playtime_2weeks ? formatSteamPlaytime(game.playtime_2weeks) : 'unknown',
        })
}

function ownedGameEmbed(game: ownedGame): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(game.name || 'unknown')
        .setColor('#000EFF') // Blue
        .setImage(
            game.appid && game.img_icon_url ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg` : null
        )
        .addFields({
            name: 'Play Time:',
            value: game.playtime_forever ? formatSteamPlaytime(game.playtime_forever) : 'unknown',
        })
}

function wishlistGameEmbed(game: wishlistGame) {
    return new EmbedBuilder()
        .setTitle(game.name || 'Missing Title')
        .setImage(game.capsule || game.background || null)
        .setFooter({ text: `Release: ${game.release_string || 'unknown'}` })
        .setColor('#000EFF') // Blue
        .addFields({
            name: 'Reviews:',
            value: game.reviews_percent ? `${game.reviews_percent}% positive` : 'unknown',
            inline: false
        })
        .addFields({
            name: 'Free:',
            value: String(Boolean(game.is_free_game)),
            inline: false
        })
        .addFields({
            name: 'Tags:',
            value: game.tags ? game.tags.join(', ') : 'none',
            inline: false
        })
}

function playerBansEmbed(bansData: playerBansData) {
    return new EmbedBuilder()
        .setColor('#000EFF') // Blue
        .setTitle('Bans Data')
        .addFields({
            name: 'Community Banned:',
            value: bansData.CommunityBanned === undefined ? 'unkown' : String(bansData.CommunityBanned),
            inline: false
        })
        .addFields({
            name: 'Days Since Last Ban:',
            value: String(bansData.DaysSinceLastBan ?? 'unknown'),
            inline: false
        })
        .addFields({
            name: 'VAC Bans:',
            value: String(bansData.NumberOfVACBans ?? 'unknown'),
            inline: false
        })
        .addFields({
            name: 'Economy Ban:',
            value: String(bansData.EconomyBan ?? 'unknown'),
            inline: false
        })
        .addFields({
            name: 'Number of Game Bans:',
            value: String(bansData.NumberOfGameBans ?? 'unknown'),
            inline: false
        })
}

export {
    errorEmbed,
    infoEmbed,
    playerProfileEmbed,
    recentGameEmbed,
    ownedGameEmbed,
    wishlistGameEmbed,
    playerBansEmbed,
}