import { BadGatewayError, BadRequestError } from '../errors';
import { UserModel } from '../db/models';
import { Config } from '../../config';
import axios, * as _ from 'axios'
import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    User,
    EmbedBuilder,
    ChannelType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js'

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

        const res = await axios.get(`
            http://api.steampowered.com/ISteamUser/GetFriendList/v0001/
            ?key=${Config.steamAPIKey}
            &steamid=${steamID}
            &relationship=friend
        `)
        .catch(err => {
            throw new BadGatewayError('Error getting friends list.')
        })

        console.log(res)

        return
        let wishlistItems: wishlistItem[] = Object.values(res.data)

        if (!wishlistItems.length) {
            throw new BadRequestError('User has empty wishlist.')
        }

        const reviewsOption = interaction.options.getString('reviews')
        const freeOption = interaction.options.getBoolean('free')

        if (freeOption !== null) {
            wishlistItems = wishlistItems.filter((item): boolean => Boolean(item.is_free_game) === freeOption)
        }

        if (reviewsOption) {
            wishlistItems = wishlistItems.filter((item): boolean => item.review_desc === reviewsOption)
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

        if (!wishlistEmbeds.length) {
            throw new BadRequestError('No wishlist items found.')
        }

        const embedGroups = [];

        while (wishlistEmbeds.length > 0) {
            embedGroups.push(wishlistEmbeds.splice(0, 10))
        }

        if (interaction.channel?.type !== ChannelType.GuildText) {
            return
        }

        await interaction.reply({ embeds: embedGroups[0], ephemeral: true })

        await Promise.all(embedGroups.slice(1).map((embedGroup) => interaction.followUp({ embeds: embedGroup, ephemeral: true })))

        const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
            .setLabel(`Next Page ⏩`)
            .setCustomId(JSON.stringify({
                type: 'wishlist',
                data: {
                    page: 0,
                    steamID: 'user.steamID',
                    filters: {
                        free: freeOption,
                        reviews: reviewsOption
                    }
                }
            }))
            .setStyle(ButtonStyle.Primary)
        )

        interaction.followUp({ components: [row], ephemeral: true })
    },
};