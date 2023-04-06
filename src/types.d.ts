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

interface connection {
    type: string
    id: string
    name: string
    visibility: number
    friend_sync: boolean
    show_activity: boolean
    verified: boolean
    two_way_link: boolean
    metadata_visibility: number
}