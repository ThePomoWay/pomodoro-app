export function getFormattedDate() {
    let today = new Date();
    return  `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`
}