import { getHours } from "date-fns";
import { NewLineKind } from "typescript";
import { months, shortWeekDays } from "../../utils/constants";
import {
  daysInMonth,
  getDaysDiff,
  getHourText,
  getMinsDiff,
  getPreviousMonday,
} from "../../utils/date-utils";

export function processStats(
  from,
  to,
  statsArr,
  defaultWorkTime,
  completedTasks
) {
  let diff = getDaysDiff(from, to);
  let oldStatsFrom = new Date(from).getTime();
  let oldStatsTo, statsFrom;
  let statsTo = new Date(to).setHours(11, 59, 59, 999);
  let type;
  if (diff < 3) {
    // Stats for day
    oldStatsFrom = new Date(from).getTime();
    oldStatsTo = new Date(from).setHours(11, 59, 59, 999);
    statsFrom = new Date(to).setHours(0, 0, 0, 0);
    type = "daily";
  } else if (diff < 15) {
    let previousMonday = new Date(getPreviousMonday(to));
    //stats for week

    statsFrom = previousMonday.setHours(0, 0, 0, 0);
    oldStatsTo = new Date(
      previousMonday.getFullYear(),
      previousMonday.getMonth(),
      previousMonday.getDate() - 1
    ).setHours(11, 59, 59, 999);
    type = "weekly";
  } else {
    //stats for month
    let t = new Date(to);
    let f = new Date(from);
    statsFrom = new Date(t.getFullYear(), t.getMonth(), 1);
    oldStatsTo = new Date(f.getFullYear(), f.getMonth() + 1, 0);
    type = "monthly";
  }
  let oldStats = processStatsRange(
    oldStatsFrom,
    oldStatsTo,
    statsArr,
    type,
    defaultWorkTime,
    completedTasks
  );
  let newStats = processStatsRange(
    statsFrom,
    statsTo,
    statsArr,
    type,
    defaultWorkTime,
    completedTasks
  );
  return [oldStats, newStats];
}

export function processStatsRange(
  from,
  to,
  statsArr,
  type,
  defaultWorkTime,
  completedTasks
) {
  let statsObj = {
    dp: 0,
    ds: 0,
    p: 0,
    ps: 0,
    ft: [],
    comp: completedTasks.length,
    dailyDistributionData: {
      labels: [...Array(24)].map((item, index) => {
        return getHourText(index);
      }),
      datasets: [
        {
          data: [...Array(24)].map((item) => 0),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    },
    pomosCompletedGraph: {
      labels:
        type === "weekly"
          ? [...Array(7)].map((_, index) => shortWeekDays[index])
          : [...Array(daysInMonth(to))].map((_, index) => index + 1 + " "),
      datasets: [
        {
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          data:
            type === "weekly"
              ? [...Array(7)].map((_, index) => 0)
              : [...Array(daysInMonth(to))].map((_, index) => 0),
        },
      ],
    },
    completedTasksGraph: {
      labels:
        type === "weekly"
          ? [...Array(7)].map((_, index) => shortWeekDays[index])
          : [...Array(daysInMonth(to))].map((_, index) => index + 1 + " "),
      datasets: [
        {
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          data:
            type === "weekly"
              ? [...Array(7)].map((_, index) => 0)
              : [...Array(daysInMonth(to))].map((_, index) => 0),
        },
      ],
    },
  };

  if (!statsArr.length) {
    return statsObj;
  }

  let month = "";
  for (let stat of statsArr) {
    stat.dt = new Date(stat.dt).getTime();
    if (stat.dt <= to && stat.dt >= from) {
      let dt = new Date(stat.dt);

      stat.dt = dt.getTime();
      statsObj.dp += stat.dp;
      statsObj.ds += stat.ds;
      statsObj.p += stat.p;
      statsObj.ps += stat.ps;

      statsObj.ft.push(...stat.ft);

      month = months[dt.getMonth()];

      //Pomos completed graph
      if (type === "weekly") {
        statsObj.pomosCompletedGraph.datasets[0].data[dt.getDay()] = stat.p;
      } else if (type === "monthly") {
        statsObj.pomosCompletedGraph.datasets[0].data[dt.getDate()] = stat.p;
      }

      //Daily distribution graph

      let chartsObj = {
        labels: [...Array(24)].map((item, index) => {
          return getHourText(index);
        }),
        datasets: [],
      };
      let chartsArr = [];
      let hoursObj = {};
      for (let pomo of statsObj.ft) {
        let st = new Date(pomo.st);
        let et = new Date(pomo.et);

        if (!!st.getHours() && !!et.getHours()) {
          let startHour = st.getHours();
          let endHour = et.getHours();
          if (startHour === endHour) {
            let minsDiff = getMinsDiff(st, et);

            if (hoursObj[startHour]) {
              hoursObj[startHour] += minsDiff;
            } else {
              hoursObj[startHour] = minsDiff;
            }
          } else {
            let mid = new Date(st).setHours(st.getHours() + 1, 0, 0, 0);
            let startDiff = Math.round(getMinsDiff(st, mid) * 100) / 100;
            let endDiff = Math.round(getMinsDiff(mid, et) * 100) / 100;
            if (hoursObj[startHour]) {
              hoursObj[startHour] += startDiff;
            } else {
              hoursObj[startHour] = startDiff;
            }

            if (hoursObj[endHour]) {
              hoursObj[endHour] += endDiff;
            } else {
              hoursObj[endHour] = endDiff;
            }
          }
        }
      }

      for (let i = 0; i < 24; i += 1) {
        chartsArr.push(hoursObj[i] || 0);
      }
      chartsObj.datasets = [
        {
          data: chartsArr,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ];

      statsObj.dailyDistributionData = chartsObj;
    } else {
      statsObj.dailyDistributionData = {
        labels: [...Array(24)].map((item, index) => {
          return getHourText(index);
        }),
        datasets: [
          {
            data: [...Array(24)].map((item) => 0),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      };
    }
  }

  for (let task of completedTasks) {
    let completedOn = new Date(task.completedOn);
    if (type === "weekly") {
      statsObj.completedTasksGraph.datasets[0].data[completedOn.getDay()] += 1;
    }
    if (type === "monthly") {
      statsObj.completedTasksGraph.datasets[0].data[completedOn.getDate()] += 1;
    }
  }

  if (type === "monthly") {
    statsObj.pomosCompletedGraph.labels = [
      ...statsObj.pomosCompletedGraph.labels,
    ].map((item) => item + month);
  }

  return statsObj;
}
