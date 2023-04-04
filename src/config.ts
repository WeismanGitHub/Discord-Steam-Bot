import InternalServerError from "./server/errors/internal-server";
require("dotenv").config();

// Discord
const discordToken = process.env.DISCORD_TOKEN
const testGuildID = process.env.TEST_GUILD_ID
const discordClientID = process.env.DISCORD_CLIENT_ID
const discordClientSecret = process.env.DISCORD_CLIENT_SECRET
const mainAccountID = process.env.DISCORD_MAIN_ACCOUNT_ID
const discordOAuthURL = process.env.DISCORD_OAUTH_URL

// App
const appPort = 5000
const jwtSecret = process.env.JWT_SECRET
const jwtLifetime = '14d'
const redirectURI = process.env.REDIRECT_URI

// POSTGRESQL
const postgresPassword = process.env.POSTGRES_PASSWORD
const postgresPort = 5432
const postgresUser = process.env.POSTGRES_USER
const postgresHost = process.env.POSTGRES_HOST

const config = {
    discordToken,
    testGuildID,
    discordClientID,
    discordClientSecret,
    mainAccountID,
    discordOAuthURL,
    appPort,
    jwtSecret,
    jwtLifetime,
    redirectURI,
    postgresPassword,
    postgresPort,
    postgresUser,
    postgresHost,
}

for (const entry of Object.entries(config)) {
    const [key, value] = entry
    console.log(Number.isNaN(value), value)

    if (Number.isNaN(value) || value == undefined) {
        throw new InternalServerError(`${key} is missing.`)
    }
}

export {
    discordToken,
    testGuildID,
    discordClientID,
    discordClientSecret,
    mainAccountID,
    discordOAuthURL,
    appPort,
    jwtSecret,
    jwtLifetime,
    redirectURI,
    postgresPassword,
    postgresPort,
    postgresUser,
    postgresHost,
}