function formatSteamDate(steamDate: number | undefined): string {
    const date = new Date(Number(`${steamDate}`.padEnd(13, '0')))
    const formattedDate = date.toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return formattedDate
}

export {
    formatSteamDate
}