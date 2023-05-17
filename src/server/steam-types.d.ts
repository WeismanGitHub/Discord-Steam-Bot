
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

interface ownedGamesData {
    game_count: number | undefined
    games: undefined | ownedGame[]
}

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
    id: number | undefined
    discount_block: string | undefined
    discount_pct: number | undefined
    price: number | undefined
}

interface friend {
    steamid: string | undefined
    relationship: 'friend' | undefined
    friendSince: number | undefined
}

interface recentlyPlayedGame {
    appid: number | undefined
    name: string | undefined
    playtime_2weeks: number | undefined
    playtime_forever: number | undefined
    img_icon_url: string | undefined
    playtime_windows_forever: number | undefined
    playtime_mac_forever: number | undefined
    playtime_linux_forever: number | undefined
}

interface recentlyPlayedGamesData {
    total_count: number | undefined
    games: recentlyPlayedGame[] | undefined
}