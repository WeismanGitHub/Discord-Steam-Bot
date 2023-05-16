import { BadRequestError, InternalServerError } from '../errors';
import { badgeEmbed, infoEmbed } from '../utils/embeds';
import { getBadges } from '../utils/steam';
import { UserModel } from '../db/models';
import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    User,
    EmbedBuilder,
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('badges')
		.setDescription("Get someone's badges.")
        .setDMPermission(false)
        .addUserOption(option => option
            .setName('user')
            .setDescription("The user you want to target.")
            .setRequired(true)
        )
	,
	async execute(interaction: ChatInputCommandInteraction) {
        const user: User = interaction.options.getUser('user')!
        
        if (user.bot) {
            throw new BadRequestError('User is a bot.')
        }

        const userDoc = await UserModel.findById(user.id).select('-_id steamID role').lean()
        
        if (!userDoc) {
            return interaction.reply({
                embeds: [infoEmbed('User is not in database.')],
                ephemeral: true
            })
        }

        if (userDoc.role === 'banned') {
            return interaction.reply({
                embeds: [infoEmbed('User is banned.')],
                ephemeral: true
            })
        }

        const badges = await getBadges(userDoc.steamID)

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
    },
};