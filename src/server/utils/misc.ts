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

export {
    formatSteamDate
}