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
  return diff / (1000 * 60);
}

export function getHourText(hour) {
  let st = " AM";
  if (hour > 11) {
    if (hour > 12) {
      hour %= 12;
    }
    st = " PM";
  }
  return hour + "-" + ((hour + 1) % 13 || "1") + st;
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
  mins = Math.floor(mins);
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

export function getFormattedTime(secs) {
  if (!secs) {
    return "";
  }
  secs = Math.floor(secs);
  if (secs === 0) {
    return "";
  }
  if (secs < 60) {
    return secs + " secs";
  }
  let m = secs / 60;
  if (m < 60) {
    return Math.floor(m) + " mins";
  }
  let h = Math.floor(m / 60);
  m = Math.floor(m % 60);
  return `${Math.floor(h)} hr ${m} mins`;
}

export function daysInMonth(date) {
  date = new Date(date);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function getHoursMinsDate(seconds) {
  let hours: any = Math.floor(seconds / (60 * 60));
  let mins: any = Math.floor(seconds / 60);

  if (hours < 10) {
    hours = "0" + hours;
  }

  if (mins < 10) {
    mins = "0" + mins;
  }

  return hours + ":" + mins;
}

export function getAnteMeridiemText(time = new Date()) {
  let date = new Date(time);
  let hours: string | number = date.getHours();
  let mins: string | number = date.getMinutes();
  let st = "AM";
  if (hours > 12) {
    st = "PM";
    hours %= 12;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (mins < 10) {
    mins = "0" + mins;
  }

  return `${hours}:${mins} ${st}`;
}

export function getReadableDate(time = new Date()) {
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    month[time.getMonth()] + " " + time.getDate() + ", " + time.getFullYear()
  );
}
