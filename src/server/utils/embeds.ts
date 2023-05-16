import { ownedGame, player, recentlyPlayedGame } from './steam'
import { EmbedBuilder } from "discord.js";
import { formatSteamDate, formatSteamPlaytime } from "./misc";

function errorEmbed(description: string | null = null): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle("There's been an error!")
        .setDescription(description)
        .setColor('#FF0000') // Red
}

function infoEmbed(title: string, description: null | string = null): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(title)
        .setColor('#8F00FF') // Purple
        .setDescription(description)
}

function playerProfileEmbed(player: player): EmbedBuilder {
    return new EmbedBuilder()
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
    console.log(game)
    return new EmbedBuilder()
        // .setImage(player.avatarfull || null)
        // .addFields({
        //     inline: true,
        //     name: 'Name:',
        //     value: player.personaname || 'unknown'
        // })
        // .addFields({
        //     name: 'Account Birthday:',
        //     value: formatSteamDate(player.timecreated)
        // })
}

function ownedGameEmbed(game: ownedGame): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(game.name || 'unknown')
        .setColor('#8F00FF') // Purple
        .setImage(
            game.appid && game.img_icon_url ? `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg` : null
        )
        .addFields({
            name: 'Play Time:',
            value: game.playtime_forever ? formatSteamPlaytime(game.playtime_forever) : 'unknown',
        })
}

export {
    errorEmbed,
    infoEmbed,
    playerProfileEmbed,
    recentGameEmbed,
    ownedGameEmbed,
}