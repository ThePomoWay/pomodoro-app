import { months, shortWeekDays } from "./constants";
export function getFormattedDate(date?) {
  let today = new Date();
  if (date) {
    today = new Date(date);
  }
  let month: string | number = today.getMonth() + 1;
  let day: string | number = today.getDate();

  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return `${today.getFullYear()}-${month}-${day}`;
}

export function getTodaysDateFormatted(today = new Date()) {
  return `${today.getDate()} ${
    months[today.getMonth()]
  }, ${today.getFullYear()}`;
}

export function getWeekFormattedDate(date = new Date()) {
  date = new Date(date);
  return `${shortWeekDays[date.getDay()]}, ${date.getDate()} ${months[
    date.getMonth()
  ].slice(0, 3)}`;
}

export function getTodaysISOString() {
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(today).toISOString();
}

export function getDaysDiff(a, b) {
  let diff = Math.abs(new Date(a).getTime() - new Date(b).getTime());
  return diff / (1000 * 3600 * 24);
}

export function getMinsDiff(a, b) {
  let diff = Math.abs(new Date(b).getTime() - new Date(a).getTime());
  return diff / 1000;
}

export function getHourText(hour) {
  let st = "AM";
  if (hour > 11) {
    if (hour > 12) {
      hour %= 12;
    }
    st = "PM";
  }
  return hour + ":00" + st;
}

export function getPreviousMonday(date = new Date()) {
  let d = new Date(date);
  return d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
}

export function getNextSunday(d = new Date()) {
  let date = new Date(d);
  if (date.getDay() === 7) {
    return date;
  }
  return new Date(date.setDate(date.getDate() + (7 - date.getDay())));
}

export function getTimeText(mins) {
  mins = mins.toFixed(1);
  if (mins < 60) {
    mins = Number(mins);
    return mins + " mins";
  }
  let m = mins % 60;
  let h = Math.floor(mins / 60);
  if (h === 0) {
    return `${m} mins`;
  }
  return `${Math.floor(mins / 60)} hr ${m} mins`;
}

export function daysInMonth(date) {
  date = new Date(date);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}
