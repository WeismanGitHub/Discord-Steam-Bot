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

async function getPlayerSummaries(steamIDs: string | string[]): Promise<player | undefined> {
    steamIDs = Array.isArray(steamIDs) ? steamIDs.join(',') : steamIDs

    return (await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${Config.steamAPIKey}&steamids=${steamIDs}`))?.data?.response?.players?.[0]
}

async function getSteamLevel(steamID: string): Promise<number | undefined> {
    return (await axios.get(`https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${Config.steamAPIKey}&steamid=${steamID}`)).data?.response?.player_level
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

async function getOwnedGames(steamID: string, includeFreeGames: boolean | null): Promise<ownedGamesData> {
    return (await axios.get(
        `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/
        ?key=${Config.steamAPIKey}
        &steamid=${steamID}
        &include_appinfo=true
        ${includeFreeGames !== null ? `&include_played_free_games=${includeFreeGames}` : ''}`
    )
    .catch((err: Error) => {
        throw new BadGatewayError('Error getting owned games.')
    })).data?.response
}

export {
    getPlayerSummaries,
    getSteamLevel,
    getOwnedGames,
}