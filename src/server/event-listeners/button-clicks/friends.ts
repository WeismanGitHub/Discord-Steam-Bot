
import { getFriendsList, getPlayerSummaries } from "../../utils/steam"
import { infoEmbed, playerProfileEmbed } from "../../utils/embeds"
import { ButtonInteraction, Events } from "discord.js"
import { InternalServerError } from "../../errors"

export default {
	name: Events.InteractionCreate,
	once: false,
    execute: async (interaction: ButtonInteraction) => {
        if (!interaction.isButton()) {
            return
        }

        interface friendsData {
            steamID: string
        }

        const { type, data }: CustomID<friendsData> = JSON.parse(interaction.customId)
        const { steamID } = data

        if (type !== 'friends') {
            return
        }

        const friends = await getFriendsList(steamID)
    
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
    }
}