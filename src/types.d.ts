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

interface User extends Document {
    _id: string
    steamID: string,
    level: 'user' | 'admin' | 'owner'
}

declare namespace Express {
    export interface Request {
        user?: User
        userID?: string
    }
}

interface GuildData {
    name: string
    iconURL: string | null
    memberCount: number
    joinedTimestamp: number
    preferredLocale: string
}

interface CustomActivity {
    type: number | undefined | string
    name: string | undefined
}