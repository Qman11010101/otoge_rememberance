export function timeText(t) {
    const actual = t
    const hours = String(Math.floor(actual / 3600)).padStart(2, "0")
    const minutes = String(Math.floor((actual % 3600) / 60)).padStart(2, "0")
    const seconds = String(Math.floor(actual % 60)).padStart(2, "0")
    return `${hours}:${minutes}:${seconds}`
}