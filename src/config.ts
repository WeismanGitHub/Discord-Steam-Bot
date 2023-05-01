import { InternalServerError } from "./server/errors";
import { ActivityType } from "discord.js";
require("dotenv").config();
import path from "path";
import fs from 'fs'

class Configuration {
    discordToken: string
    testGuildID: string
    discordClientID: string
    discordClientSecret: string
    mainAccountID: string
    activityName: string
    activityType: number
    appPort: number
    jwtSecret: string
    authRedirectURI: string
    loginRedirectURI: string
    buyMeACofeeLink: string
    sourceCodeLink: string
    steamAPIKey: string
    mongoURI: string
    mongoMaxPoolSize: number
    mongoWtimeoutMS: number
    limiterWindowMs: number
    limiterMax: number
    limiterMessage: string
    limiterStandardHeaders: boolean
    limiterLegacyHeaders: boolean
    botInviteLink: string
    websiteLink: string

    constructor() {
        const rawActivity = fs.readFileSync(path.resolve('./activity.json'), 'utf8')
        const activity: CustomActivity = JSON.parse(rawActivity)
        
        if (activity.type === undefined || !activity.name || ActivityType[Number(activity.type)] === undefined) {
            throw new InternalServerError('Invalid activity type.')
        }

        // Discord
        this.discordToken = process.env.DISCORD_TOKEN!
        this.testGuildID = process.env.TEST_GUILD_ID!
        this.discordClientID = process.env.DISCORD_CLIENT_ID!
        this.discordClientSecret = process.env.DISCORD_CLIENT_SECRET!
        this.mainAccountID = process.env.DISCORD_MAIN_ACCOUNT_ID!
        this.activityType = Number(activity.type)
        this.activityName = activity.name
        this.botInviteLink = process.env.REACT_APP_BOT_INVITE_LINK!
        this.websiteLink = process.env.WEBSITE_LINK!

        // App
        this.appPort = 5000
        this.jwtSecret = process.env.JWT_SECRET!
        this.authRedirectURI = process.env.AUTH_REDIRECT_URI!
        this.loginRedirectURI = process.env.LOGIN_REDIRECT_URI!
        this.buyMeACofeeLink = process.env.REACT_APP_BUY_ME_A_COFFEE_LINK!
        this.sourceCodeLink = process.env.REACT_APP_SOURCE_CODE_LINK!
        this.steamAPIKey = process.env.STEAM_API_KEY!

        // Mongodb
        this.mongoURI = process.env.MONGO_URI!
        this.mongoMaxPoolSize = 50
        this.mongoWtimeoutMS = 2500

        // Rate Limiter
        this.limiterWindowMs = 2000
        this.limiterMax = 30
        this.limiterMessage = 'Rate Limit = 30 requests per two seconds.'
        this.limiterStandardHeaders = true
        this.limiterLegacyHeaders = false

        for (const entry of Object.entries(this)) {
            const [key, value] = entry
        
            if (Number.isNaN(value) || value === undefined) {
                throw new InternalServerError(`${key} is missing.`)
            }
        }
    }
}

const Config = new Configuration()

export { Config }