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
    return ''
}

export {
    formatSteamDate,
    formatSteamPlaytime,
}