import { SlashCommandBuilder, ChatInputCommandInteraction, User, EmbedBuilder, ChannelType } from 'discord.js'
import { BadRequestError, InternalServerError } from '../errors';
import { UserModel } from '../db/models';
import axios, * as _ from 'axios'

export default {
	data: new SlashCommandBuilder()
		.setName('wishlist')
		.setDescription("Get someone's Steam wish list.")
        .setDMPermission(false)
        .addUserOption(option => option
            .setName('user')
            .setDescription("The user you want to target.")
            .setRequired(true)
        )
        .addBooleanOption(option => option
            .setName('free')
            .setDescription("Filter by if it's free or not.")
        )
        .addStringOption(option => option
            .setName('reviews')
            .setDescription("Filter by reviews.")
            .addChoices(
                { name: 'Overwhelmingly Positive', value: 'Overwhelmingly Positive'},
                { name: 'Very Positive', value: 'Very Positive'},
                { name: 'Positive', value: 'Positive'},
                { name: 'Mostly Positive', value: 'Mostly Positive'},
                { name: 'Mixed', value: 'Mixed'},
                { name: 'Mostly Negative', value: 'Mostly Negative'},
                { name: 'Negative', value: 'Negative'},
                { name: 'Very Negative', value: 'Very Negative'},
                { name: 'Overwhelmingly Negative', value: 'Overwhelmingly Negative'},
                { name: 'No User Reviews', value: 'No user reviews'},
            )
        )
	,
	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.isCommand()) return;

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

        let wishlistItems: wishlistItem[] = Object.values(res.data)

        if (!wishlistItems) {
            throw new BadRequestError('User has empty wishlist.')
        }

        const reviewsOption = interaction.options.getString('reviews')
        const freeOption = interaction.options.getBoolean('free')

        if (freeOption !== null) {
            wishlistItems = wishlistItems.filter((item): boolean => Boolean(item.is_free_game) == freeOption)
        }

        if (reviewsOption) {
            wishlistItems = wishlistItems.filter((item): boolean => item.review_desc == reviewsOption)
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

        for (let embedGroup of embedGroups.slice(1)) {
            interaction.followUp({ embeds: embedGroup, ephemeral: true })
        };
    },
};


//     capsule: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1206560/header_292x136.jpg?t=1659920810',
//     review_score: 8,
//     review_desc: 'Very Positive',
//     reviews_total: '18,891',
//     reviews_percent: 95,
//     release_date: '1638466470',
//     release_string: 'Dec 2, 2021',
//     platform_icons: '<span class="platform_img win"></span><span class="platform_img mac"></span><span class="platform_img linux"></span>',
//     subs: [
//       {
//         id: 416777,
//         discount_block: '<div class="discount_block discount_block_large no_discount" data-price-final="1999"><div class="discount_prices"><div class="discount_final_price">$19.99</div></div></div>',
//         discount_pct: 0,
//         price: 1999
//       }
//     ],
//     type: 'Game',
//     screenshots: [
//       'ss_c8308f959146715491fa734ade1a708392c080e8.jpg',
//       'ss_54c925a46d6b769b22fdde20c88b61f7e4a4d426.jpg',
//       'ss_323a5b3a7c389e16fa596d9ea079c0f72325cada.jpg',
//       'ss_377d5bb3ed51434bb45ed673ae8074b3329a4a6a.jpg'
//     ],
//     review_css: 'positive',
//     priority: 0,
//     added: 1656043953,
//     background: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1159290/page_bg_generated_v6b.jpg?t=1665335898',
//     rank: 711,
//     tags: [
//       'Early Access',
//       'God Game',
//       'Sandbox',
//       'Pixel Graphics',
//       'Simulation'
//     ],
//     is_free_game: false,
//     deck_compat: '3',
//     early_access: 1,
//     win: 1,
//     mac: 1,
//     linux: 1
