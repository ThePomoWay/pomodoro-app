import { getFormattedDate } from "../../utils/date-utils";

export const statsQueueLSKey = "statsQueue";

export function pushToStatsUpdateQueueIDB(
  startTime,
  endTime,
  type,
  isDistracted,
  pomoSummary,
  completedTid?
) {
  return new Promise((res, rej) => {
    let body = {
      startDate: getFormattedDate(startTime),
      st: startTime,
      et: endTime,
      type,
      isDistracted,
      pomoSummary,
    };

    if (completedTid) {
      body["completedTID"] = completedTid;
    }

    let statsQueLS: any = localStorage.getItem(statsQueueLSKey);
    if (!statsQueLS) {
      statsQueLS = [];
    } else {
      statsQueLS = JSON.parse(statsQueLS);
    }

    statsQueLS.push(body);
    localStorage.setItem(statsQueueLSKey, JSON.stringify(statsQueLS));
  });
}

export function getStatsQueue() {
  return JSON.parse(localStorage.getItem(statsQueueLSKey) || "[]");
}
