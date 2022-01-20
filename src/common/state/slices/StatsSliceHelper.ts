import { NewLineKind } from "typescript";
import { getDaysDiff, getPreviousMonday } from "../../utils/date-utils";

export function processStats(from, to, statsArr) {
    let diff = getDaysDiff(from, to);
    let oldStatsFrom = new Date(from).getTime()
    let oldStatsTo, statsFrom
    let statsTo = new Date(to).setHours(11,59,59,999);
    if(diff < 3) {
        // Stats for day
        oldStatsFrom = new Date(from).getTime();
        oldStatsTo = new Date(from).setHours(11, 59, 59, 999);
        statsFrom = new Date(to).setHours(0,0,0,0);
    }
    else if(diff < 15) {
        let previousMonday = new Date(getPreviousMonday(to));
        //stats for week

        statsFrom = previousMonday.setHours(0,0,0,0);
        oldStatsTo = new Date(previousMonday.getFullYear(), previousMonday.getMonth(), previousMonday.getDate() - 1).setHours(11,59,59,999);
    }
    else {
        //stats for month
        let t = new Date(to);
        let f = new Date(from);
        statsFrom = new Date(t.getFullYear(), t.getMonth(), 1);
        oldStatsTo = new Date(f.getFullYear(), f.getMonth() + 1, 0);
    }
    let oldStats = processStatsRange(oldStatsFrom, oldStatsTo, statsArr)
    let newStats = processStatsRange(statsFrom, statsTo, statsArr)
    return [oldStats, newStats];
}

export function processStatsRange(from, to, statsArr) {
    let statsObj = {
        dp: 0,
        ds: 0,
        p: 0,
        ps: 0,
        ft: []
    }
    for(let stat of statsArr) {
        stat.dt = new Date(stat.dt).getTime();
        if(stat.dt <= to && stat.dt >= from) {
            statsObj.dp += stat.dp;
            statsObj.ds += stat.ds;
            statsObj.p += stat.p;
            statsObj.ps += stat.ps;

            statsObj.ft.push(...stat.ft);
        }
    }

    return statsObj;
}