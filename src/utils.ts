export function formatDate(date: Date): string {
    // returns date as 29/03/2021
    return date.toLocaleDateString('en-GB')
}
