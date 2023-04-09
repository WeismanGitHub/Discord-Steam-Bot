import { EmbedBuilder } from "discord.js";

function errorEmbed(description: string | null = null): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle("There's been an error!")
        .setDescription(description)
        .setColor('#FF0000') // Red
}

function titleEmbed(title: string): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(title)
        .setColor('#8F00FF') // Purple
}

export {
    errorEmbed,
    titleEmbed,
}