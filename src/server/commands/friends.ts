import { getFriendsList, getPlayerSummaries } from '../utils/steam';
import { BadRequestError, InternalServerError } from '../errors';
import { UserModel } from '../db/models';
import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    User,
    EmbedBuilder,
} from 'discord.js'
import { titleEmbed } from '../utils/embeds';

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

        const steamID = (await UserModel.findById(user.id).select('-_id steamID').lean())?.steamID

        if (!steamID) {
            throw new BadRequestError('User is not in database.')
        }

        const friends = await getFriendsList(steamID)

        if (!friends) {
            throw new InternalServerError('Could not get friends.')
        }
        
        const friendsProfiles = await getPlayerSummaries(friends.map(friend => friend.steamid))

        if (!friendsProfiles?.length) {
            throw new BadRequestError('User has no friends.')
        }

        const friendsEmbeds = friendsProfiles.map((friend): EmbedBuilder => {
            return new EmbedBuilder()
            .setTitle(friend.personaname || 'Missing Name')
        })

        const embedGroups = [];

        while (friendsEmbeds.length > 0) {
            embedGroups.push(friendsEmbeds.splice(0, 10))
        }

        await interaction.reply({ embeds: embedGroups[0], ephemeral: true })

        await Promise.all(embedGroups.slice(1).map((embedGroup) => interaction.followUp({ embeds: embedGroup, ephemeral: true })))

        interaction.followUp({
            embeds: [titleEmbed(`Friend Count: ${friends.length ?? 'unknown'}`)],
            ephemeral: true
        })
    },
};