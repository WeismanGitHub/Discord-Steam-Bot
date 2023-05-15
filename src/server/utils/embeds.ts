import { EmbedBuilder } from "discord.js";
import { formatSteamDate } from "./misc";
import { player } from './steam'

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

export {
    errorEmbed,
    infoEmbed,
    playerProfileEmbed
}