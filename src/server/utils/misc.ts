import { Locale } from "discord.js"

function formatSteamDate(steamDate: number | undefined): string {
    const date = new Date(Number(`${steamDate}000`))
    const formattedDate = date.toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return formattedDate
}

function formatSteamPlaytime(playtime: number): string {
    const playTime = String(playtime)
    
    if (playTime.length === 1) return `0.0${playTime} hours`
    if (playTime.length === 2) return `0.${playTime} hours`

    const position = String(playTime).length - 2;
    const formattedPlaytime = [playTime.slice(0, position), '.', playTime.slice(position)].join('');
    return `${formattedPlaytime} hours`
}

function formatDate(date: Date, locale: Locale | null = null): string {
    const formattedDate = date.toLocaleDateString(locale ?? "en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return formattedDate
}

export {
    formatSteamDate,
    formatSteamPlaytime,
    formatDate,
}