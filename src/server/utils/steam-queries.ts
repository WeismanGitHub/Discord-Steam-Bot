import { Config } from '../../config'
import axios, * as _ from 'axios'

async function getPlayerSummaries(steamID: string): Promise<player | undefined> {
    return (await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${Config.steamAPIKey}&steamids=${steamID}`))?.data?.response?.players?.[0]
}

async function getSteamLevel(steamID: string): Promise<number | undefined> {
    return (await axios.get(`https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${Config.steamAPIKey}&steamid=${steamID}`)).data?.response?.player_level
}

export {
    getPlayerSummaries,
    getSteamLevel,
}