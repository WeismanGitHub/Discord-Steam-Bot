import { SlashCommandBuilder, CommandInteraction, User, EmbedBuilder, ChannelType } from 'discord.js'
import { BadRequestError, InternalServerError } from '../errors';
import { UserModel } from '../db/models';
import axios, * as _ from 'axios'

export default {
	data: new SlashCommandBuilder()
		.setName('wishlist')
		.setDescription("Get someone's Steam wish list.")
        .setDMPermission(false)
        .addUserOption(option => option
            .setDescription("The user you want to target.")
            .setName('user')
            .setRequired(true)
        )
	,
	async execute(interaction: CommandInteraction): Promise<void> {
        const selectedUser: User = interaction.options.getUser('user')!

        const user = await UserModel.findById(selectedUser.id).select('-_id steamID').lean()

        if (!user) {
            throw new BadRequestError('User is not in database.')
        }

        const res = await axios.get(`https://store.steampowered.com/wishlist/profiles/${user.steamID}/wishlistdata/?p=0`)
        .catch(err => {
            throw new InternalServerError('Error getting wishlist.')
        })

        if (!res?.data) {
            throw new InternalServerError('Error getting wishlist.')
        }

        const wishlistItems: wishlistItem[] = Object.values(res.data)

        if (!wishlistItems) {
            throw new BadRequestError('User has empty wishlist.')
        }

        const wishlistEmbeds: EmbedBuilder[] = wishlistItems.map((item): EmbedBuilder => {
            return new EmbedBuilder()
            .setTitle(item.name || 'Missing Title')
            .setImage(item.capsule || item.background || null)
            .setFooter({ text: `Release: ${item.release_string || 'unknown'}` })
            .setColor('#8F00FF') // Purple
            .addFields({
                name: 'Reviews:',
                value: item.reviews_percent ? `${item.reviews_percent}% positive` : 'unknown',
                inline: false
            })
            .addFields({
                name: 'Free:',
                value: String(Boolean(item.is_free_game)),
                inline: false
            })
            .addFields({
                name: 'Tags:',
                value: item.tags ? item.tags.join(', ') : 'none',
                inline: false
            })
        })

        const embedGroups = [];

        while (wishlistEmbeds.length > 0) {
            embedGroups.push(wishlistEmbeds.splice(0, 10))
        }

        if (interaction.channel?.type !== ChannelType.GuildText) {
            return
        }

        await interaction.reply({ embeds: embedGroups[0] })

        for (let embedGroup of embedGroups.slice(1)) {
            interaction.followUp({ embeds: embedGroup })
        };
    },
};