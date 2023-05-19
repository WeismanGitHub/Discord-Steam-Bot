import { BadGatewayError } from '../errors'
import { Config } from '../../config'
import axios, * as _ from 'axios'

async function getOwnedGames(steamID: string, includeFreeGames: boolean | null): Promise<ownedGamesData | undefined> {
    const res = await axios.get(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v1?key=${Config.steamAPIKey}&steamid=${steamID}&include_appinfo=true${includeFreeGames !== null ? `&include_played_free_games=${includeFreeGames}` : ''}`)
    .catch((err: Error) => {
        throw new BadGatewayError('Error getting owned games.')
    })

    return res.data?.response
}

async function getWishlist(steamID: string, page: number | string): Promise<wishlistGame[] | undefined> {
    const res = await axios.get(`https://store.steampowered.com/wishlist/profiles/${steamID}/wishlistdata/?p=${page}`)
    .catch(err => {
        throw new BadGatewayError('Error getting wishlist.')
    })

    return Object.values(res.data)
}

async function getFriendsList(steamID: string): Promise<friend[] | undefined> {
    const res = await axios.get(`https://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${Config.steamAPIKey}&steamid=${steamID}&relationship=friend`)
    .catch(err => {
        throw new BadGatewayError('Error getting friends.')
    })

    return res.data?.friendslist?.friends
}

async function getPlayerSummaries(steamIDs: string | string[]): Promise<player[] | undefined> {
    if (Array.isArray(steamIDs)) {
        const steamIDGroups: string[] = []

        while (steamIDs.length > 0) {
            steamIDGroups.push(steamIDs.splice(0, 100).join(','))
        }

        const playersPromises = steamIDGroups.map(async (steamIDsGroup): Promise<player[]> => {
            const { data } = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${Config.steamAPIKey}&steamids=${steamIDsGroup}`)
            .catch(err => {
                throw new BadGatewayError('Error getting player(s) data.')
            })

            if (!data?.response?.players) {
                throw new BadGatewayError('Error getting player(s) data.')
            }

            return data?.response?.players
        })

        return (await Promise.all(playersPromises)).flat()
    }

    const res = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${Config.steamAPIKey}&steamids=${steamIDs}`)
    .catch(err => {
        throw new BadGatewayError('Error getting player(s) data.')
    })

    return res.data?.response?.players
}

async function getSteamLevel(steamID: string): Promise<number | undefined> {
    const res = await axios.get(`https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${Config.steamAPIKey}&steamid=${steamID}`)
    .catch(err => {
        throw new BadGatewayError('Error getting steam level.')
    })

    return res.data?.response?.player_level
}

async function getRecentlyPlayedGames(steamID: string): Promise<recentlyPlayedGamesData | undefined> {
    const res = await axios.get(`https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${Config.steamAPIKey}&steamid=${steamID}`)
    .catch(err => {
        throw new BadGatewayError('Error getting recently played games.')
    })

    return res.data?.response
}

async function getPlayerBans(steamID: string): Promise<playerBansData | undefined> {
    const res = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${Config.steamAPIKey}&steamids=${steamID}`)
    .catch(err => {
        throw new BadGatewayError('Error getting player bans.')
    })

    return res.data.players?.[0]
}

export {
    getPlayerSummaries,
    getSteamLevel,
    getOwnedGames,
    getWishlist,
    getFriendsList,
    getRecentlyPlayedGames,
    getPlayerBans,
}