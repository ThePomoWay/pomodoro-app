import { Task } from "../models/Task";
import { months } from "./constants";

export function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

export function groupByDates(tasks: Array<Task>) {
    let datesArr = [];
    let taskObj = {};

    for(let task of tasks) {
        let dateStr = getDate(task.schedule);
        if(dateStr in taskObj) {
            taskObj[dateStr].push(task)
        }
        else {
            datesArr.push(dateStr);
            taskObj[dateStr] = [task];
        }
    }

    datesArr.sort((a,b) => (new Date(a).getTime() - new Date(b).getTime()));

    return [datesArr, taskObj];
}

export function getDate(date) {
    if(date) {
        date = new Date(date);
        return (date.getMonth()+1) + '-' + date.getDate() + '-' + date.getFullYear();
    }
    return '';
}

export function getDateStr(date) {
    if(date) {
        date = new Date(date);
        let day = date.getDate();
        if(day === 1) {
            day += 'st';
        }
        else if(day === 2) {
            day += 'nd'
        }
        else if(day === 3) {
            day += 'rd';
        }
        else {
            day += 'th';
        }
        return day + ' ' + months[date.getMonth()];
    }
}

export function getTimerString(timer) {
    let minutes: any = Math.floor(timer/60);
    let seconds: any = timer % 60;

    if(minutes < 10) {
        minutes = '0' + minutes;
    }

    if(seconds < 10) {
        seconds = '0' + seconds;
    }

    return minutes + ':' + seconds;
}

export function allowOnlyOneTab(redirectUrl, ogUrl) {
    let openTabs = Number(localStorage.openTabs);
    if(!openTabs) {
        openTabs = 1;
    }
    else {
        openTabs += 1;
    }

    if(openTabs > 1 && redirectUrl) {
        window.location.href = redirectUrl;
    }

    localStorage.openTabs = openTabs;

    addWindowUnloadFn(() => {
        localStorage.openTabs = Number(localStorage.openTabs) - 1
    })

    window.addEventListener('storage', (event) => {
        if(event.key === 'openTabs') {
            let numOpenTabs = Number(localStorage.openTabs);
            if(numOpenTabs === 1 && ogUrl){
                window.location.href = ogUrl;
            }
        }
    }, false)    
}

let unloadQueue = [];
export function addWindowUnloadFn(fn) {
    unloadQueue.push(fn);
}

window.onunload = () => {
    unloadQueue.forEach(el => el());
}