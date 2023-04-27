import { Config } from '../../config'
import axios, * as _ from 'axios'

async function getPlayerSummaries(steamID: string): Promise<player | undefined> {
    return (await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${Config.steamAPIKey}&steamids=${steamID}`))?.data?.response?.players?.[0]
}

export {
    getPlayerSummaries
}