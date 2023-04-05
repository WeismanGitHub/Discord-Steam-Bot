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
    postgresPassword: undefined | string
    postgresPort: number
    postgresUser: undefined | string
    postgresHost: undefined | string
    postgresMax: undefined | number
    postgresConnectionTimeoutMillis: undefined | number

    // Rate Limiter
    windowMs: number
    max: number
    message: string
    standardHeaders: boolean
    legacyHeaders: boolean,
}