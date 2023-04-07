import { SlashCommandBuilder, CommandInteraction, User, EmbedBuilder } from 'discord.js'
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
            console.log(item?.subs)

            return new EmbedBuilder()
            .setTitle(item.name || 'Missing Title')
            // .addFields({ name: 'Tags:', value: tags.join(', ') })
            // .addFields({ name: 'ID:', value: `${quote._id}` })
            // .setImage(quote.attachmentURL)
            // .setTimestamp(quote.createdAt)
            // .setFooter({ text: quote.attachmentURL ? 'image' : quote.type })
        })

        console.log(wishlistEmbeds)
	},
};
