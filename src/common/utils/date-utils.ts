import { months } from "./constants";
export function getFormattedDate(date?) {

    let today = new Date();
    if(date) {
        today = new Date(date);
    }
    let month: string|number = today.getMonth() + 1;
    let day: string|number = today.getDate();

    if(month < 10) {
        month = '0' + month;
    }
    if(day < 10) {
        day = '0' + day;
    }
    return  `${today.getFullYear()}-${month}-${day}`;
}

export function getTodaysDateFormatted() {
    let today = new Date();
    return `${today.getDate()} ${months[today.getMonth()]}, ${today.getFullYear()}`
}

export function getTodaysISOString() {
    let today = new Date();
    today.setHours(0,0,0,0);
    return new Date(today).toISOString();
}

export function getDaysDiff(a, b) {
    let diff = Math.abs(new Date(a).getTime() - new Date(b).getTime());
    return diff / (1000 * 3600 * 24);
}

export function getPreviousMonday(date = new Date()) {
    let d = new Date(date);
    return d.setDate(d.getDate() - (d.getDay() + 6) % 7);
}