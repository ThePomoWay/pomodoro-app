import { months } from "./constants";
export function getFormattedDate() {
    let today = new Date();
    return  `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`
}

export function getTodaysDateFormatted() {
    let today = new Date();
    return `${today.getDate()} ${months[today.getMonth()]}, ${today.getFullYear()}`
}