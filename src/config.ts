import InternalServerError from "./server/errors/internal-server";
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

    // App
    appPort: 5000,
    jwtSecret: process.env.JWT_SECRET,
    jwtLifetime: '14d',
    redirectURI: process.env.REDIRECT_URI,

    // Postgres
    postgresPassword: process.env.POSTGRES_PASSWORD,
    postgresPort: 5432,
    postgresUser: process.env.POSTGRES_USER,
    postgresHost: process.env.POSTGRES_HOST,

    // Rate Limiter
    windowMs: 1000,
    max: 15,
    message: 'Rate Limit: 15 requests per second',
    standardHeaders: true,
    legacyHeaders: false,
}

for (const entry of Object.entries(config)) {
    const [key, value] = entry

    if (Number.isNaN(value) || value == undefined) {
        throw new InternalServerError(`${key} is missing.`)
    }
}

export { config }