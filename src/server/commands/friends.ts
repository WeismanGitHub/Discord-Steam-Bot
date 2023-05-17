import { SlashCommandBuilder, ChatInputCommandInteraction, User } from 'discord.js'
import { getFriendsList, getPlayerSummaries } from '../utils/steam';
import { BadRequestError, InternalServerError } from '../errors';
import { infoEmbed, playerProfileEmbed } from '../utils/embeds';
import { UserModel } from '../db/models';

export default {
	data: new SlashCommandBuilder()
		.setName('friends')
		.setDescription("Get someone's friend list.")
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

        const friends = await getFriendsList(userDoc.steamID)

        if (!friends) {
            throw new InternalServerError('Could not get friends.')
        }
        
        const friendsProfiles = await getPlayerSummaries(friends.map(friend => {
            if (!friend?.steamid) {
                throw new InternalServerError('Could not get friend ids')
            }
            
            return friend.steamid
        }))

        if (!friendsProfiles?.length) {
            return interaction.reply({
                embeds: [infoEmbed('User has no friends.')],
                ephemeral: true
            })
        }

        const friendsEmbeds = friendsProfiles.map((friend) => playerProfileEmbed(friend))
        const embedGroups = [];

        while (friendsEmbeds.length > 0) {
            embedGroups.push(friendsEmbeds.splice(0, 10))
        }

        await interaction.reply({ embeds: embedGroups[0], ephemeral: true })

        await Promise.all(embedGroups.slice(1).map((embedGroup) => interaction.followUp({ embeds: embedGroup, ephemeral: true })))

        interaction.followUp({
            embeds: [infoEmbed(`Friend Count: ${friends.length ?? 'unknown'}`)],
            ephemeral: true
        })
    },
};