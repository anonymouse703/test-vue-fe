export function formatTimeRange(start: string, end: string, locale = 'en-PH'): string {
    if (!start || !end) return ''

    const startDate = new Date(`1970-01-01T${start}:00`)
    const endDate = new Date(`1970-01-01T${end}:00`)

    return `${startDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`
}
