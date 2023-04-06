interface configuration {
    // Discord
    discordToken: undefined | string
    testGuildID: undefined | string
    discordClientID: undefined | string
    discordClientSecret: undefined | string
    mainAccountID: undefined | string
    discordOAuthURL: undefined | string
    discordStatus: string
    
    // App
    appPort: number
    jwtSecret: undefined | string
    jwtLifetime: string
    redirectURI: undefined | string
    
    // POSTGRESQL
    mongoURI: string | undefined
    mongoMaxPoolSize: number
    mongoWtimeoutMS: number

    // Rate Limiter
    limiterWindowMs: number
    limiterMax: number
    limiterMessage: string
    limiterStandardHeaders: boolean
    limiterLegacyHeaders: boolean,
}