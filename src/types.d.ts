interface configuration {
    // Discord
    discordToken: undefined | string
    testGuildID: undefined | string
    discordClientID: undefined | string
    discordClientSecret: undefined | string
    mainAccountID: undefined | string
    discordStatus: string
    adminIDs: (string | undefined)[]
    
    // App
    appPort: number
    jwtSecret: undefined | string
    authRedirectURI: undefined | string
    loginRedirectURI: undefined | string
    buyMeACofeeLink: undefined | string
    sourceCodeLink: undefined | string
    steamAPIKey: undefined | string
    
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

// Wishlist items are from an outside API so you can't really trust it'll be consistent.
interface wishlistItem {
    name: undefined | string
    capsule: undefined | string
    review_score: undefined | number
    review_desc: undefined | 'Overwhelmingly Positive' | 'Very Positive' | 'Positive' | 'Mostly Positive' | 'Mixed' |'Mostly Negative' | 'Negative' | 'Very Negative' | 'Overwhelmingly Negative' | 'No user reviews'
    reviews_total: undefined | string
    reviews_percent: number | undefined
    release_date: string | undefined
    release_string: string | undefined
    platform_icons: string | undefined
    subs: wishlistSub[] | undefined
    type: string | undefined
    screenshots: string[] | undefined
    review_css: string | undefined
    priority: number | undefined
    added: number | undefined
    background: string | undefined
    rank: number | undefined
    tags: string[] | undefined
    is_free_game: boolean | undefined
    deck_compat: string | undefined
    early_access: number | undefined
    win: number | undefined
    mac: number | undefined
    linux: number | undefined
}

interface wishlistSub {
    id: number | undefiend
    discount_block: string | undefined
    discount_pct: number | undefined
    price: number | undefined
}

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

interface ownedGame {
    appid: number | undefined
    name: string | undefined
    playtime_forever: number | undefined
    img_icon_url: string | undefined
    has_community_visible_stats: boolean | undefined
    playtime_windows_forever: number | undefined
    playtime_mac_forever: number | undefined
    playtime_linux_forever: number | undefined
    rtime_last_played: number | undefined
}

declare namespace Express {
    export interface Request {
        userID: string
    }
}

interface GuildData {
    name: string
    icon: string | null
    memberCount: number
    joinedTimestamp: number
    preferredLocale: string
}