export function formatAsIsoNoSeconds(date) {
    return date.toISOString().slice(0, 16) + "Z";
}
