import { InternalServerError } from "./server/errors";
require("dotenv").config();

const config: configuration = {
    // Discord
    discordToken: process.env.DISCORD_TOKEN,
    testGuildID: process.env.TEST_GUILD_ID,
    discordClientID: process.env.DISCORD_CLIENT_ID,
    discordClientSecret: process.env.DISCORD_CLIENT_SECRET,
    mainAccountID: process.env.DISCORD_MAIN_ACCOUNT_ID,
    discordOAuthURL: process.env.DISCORD_OAUTH_URL,
    discordStatus: 'something',
    adminIDs: [process.env.DISCORD_MAIN_ACCOUNT_ID],

    // App
    appPort: 5000,
    jwtSecret: process.env.JWT_SECRET,
    redirectURI: process.env.REDIRECT_URI,
    buyMeACofeeLink: process.env.BUY_ME_A_COFFEE_LINK,
    sourceCodeLink: process.env.SOURCE_CODE_LINK,
    steamAPIKey: process.env.STEAM_API_KEY,

    // Mongodb
    mongoURI: process.env.MONGO_URI,
    mongoMaxPoolSize: 50,
    mongoWtimeoutMS: 2500,

    // Rate Limiter
    limiterWindowMs: 1000,
    limiterMax: 15,
    limiterMessage: 'Rate Limit: 15 requests per second',
    limiterStandardHeaders: true,
    limiterLegacyHeaders: false,
}

for (const entry of Object.entries(config)) {
    const [key, value] = entry

    if (Number.isNaN(value) || value === undefined) {
        throw new InternalServerError(`${key} is missing.`)
    }
}

export { config }