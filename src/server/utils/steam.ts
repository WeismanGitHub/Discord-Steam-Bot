import { BadGatewayError } from '../errors'
import { Config } from '../../config'
import axios, * as _ from 'axios'

interface player {
    steamid: string | undefined
    communityvisibilitystate: number | undefined
    profilestate: number | undefined
    personaname: string | undefined
    commentpermission: number | undefined
    profileurl: string
    avatar: string | undefined
    avatarmedium: string | undefined
    avatarfull: string | undefined
    avatarhash: string | undefined
    lastlogoff: number | undefined
    personastate: number | undefined
    realname: string | undefined
    primaryclanid: string | undefined
    timecreated: number | undefined
    personastateflags: number | undefined
    loccountrycode: string | undefined
    locstatecode: string | undefined
    loccityid: number | undefined
}

async function getPlayerSummaries(steamIDs: string | string[]): Promise<player[] | undefined> {
    steamIDs = Array.isArray(steamIDs) ? steamIDs.join(',') : steamIDs

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

interface ownedGamesData {
    game_count: number | undefined
    games: undefined | {
        appid: number | undefined
        name: string | undefined
        playtime_forever: number | undefined
        img_icon_url: string | undefined
        has_community_visible_stats: boolean | undefined
        playtime_windows_forever: number | undefined
        playtime_mac_forever: number | undefined
        playtime_linux_forever: number | undefined
        rtime_last_played: number | undefined
    }[]
}

interface wishlistItem {
    name: undefined | string
    capsule: undefined | string
    review_score: undefined | number
    review_desc: undefined | 'Overwhelmingly Positive' | 'Very Positive' | 'Positive' | 'Mostly Positive' | 'Mixed' |'Mostly Negative' | 'Negative' | 'Very Negative' | 'Overwhelmingly Negative' | 'No user reviews'
    reviews_total: undefined | string
    reviews_percent: number | undefined
    release_date: string | undefined
    release_string: string | undefined
    platform_icons: string | undefined
    subs: wishlistSub[] | undefined
    type: string | undefined
    screenshots: string[] | undefined
    review_css: string | undefined
    priority: number | undefined
    added: number | undefined
    background: string | undefined
    rank: number | undefined
    tags: string[] | undefined
    is_free_game: boolean | undefined
    deck_compat: string | undefined
    early_access: number | undefined
    win: number | undefined
    mac: number | undefined
    linux: number | undefined
}

interface wishlistSub {
    id: number | undefined
    discount_block: string | undefined
    discount_pct: number | undefined
    price: number | undefined
}

async function getOwnedGames(steamID: string, includeFreeGames: boolean | null): Promise<ownedGamesData | undefined> {
    const res = await axios.get(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${Config.steamAPIKey}&steamid=${steamID}&include_appinfo=true${includeFreeGames !== null ? `&include_played_free_games=${includeFreeGames}` : ''}`)
    .catch((err: Error) => {
        throw new BadGatewayError('Error getting owned games.')
    })

    return res.data?.response
}

async function getWishlist(steamID: string, page: number | string): Promise<wishlistItem[] | undefined> {
    const res = await axios.get(`https://store.steampowered.com/wishlist/profiles/${steamID}/wishlistdata/?p=${page}`)
    .catch(err => {
        throw new BadGatewayError('Error getting wishlist.')
    })

    return Object.values(res.data)
}

interface friend {
    steamid: string
    relationship: 'friend'
    friendSince: number
}

async function getFriendsList(steamID: string): Promise<friend[] | undefined> {
    const res = await axios.get(`http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${Config.steamAPIKey}&steamid=${steamID}&relationship=friend&p=0`)
    .catch(err => {
        throw new BadGatewayError('Error getting wishlist.')
    })

    return res.data?.friendslist?.friends
}

export {
    getPlayerSummaries,
    getSteamLevel,
    getOwnedGames,
    getWishlist,
    getFriendsList,
    player,
}