import { EmbedBuilder } from "discord.js";

export default {
    errorEmbed: (description: string | null): EmbedBuilder => {
        return new EmbedBuilder()
        .setTitle("There's been an error!")
        .setDescription(description)
        .setColor('#FF0000')
    }
}