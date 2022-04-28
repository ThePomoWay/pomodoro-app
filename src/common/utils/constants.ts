export const POMO_IDLE_STATE = "pomo_idle";
export const POMO_PAUSED_STATE = "pomo_paused";
export const POMO_RUNNING_STATE = "pomo_running";
export const POMO_BREAK_IDLE_STATE = "pomo_break_idle";
export const POMO_BREAK_RUNNING_STATE = "pomo_break_running";
export const POMO_BREAK_PAUSED_STATE = "pomo_break_paused";
export const POMO_LONG_BREAK_IDLE_STATE = "pomo_long_break_idle";
export const POMO_LONG_BREAK_RUNNING_STATE = "pomo_long_break_running";
export const POMO_LONG_BREAK_PAUSED_STATE = "pomo_long_break_paused";

export const allTasksDropId = "id-2e";
export const todaysTasksDropId = "id-1e";

export let DEFAULT_WORK_TIME = 60 * 25;
export let DEFAULT_BREAK_TIME = 60 * 5;
export let DEFAULT_LONG_BREAK_TIME = 60 * 15;

//stats
export const STATS_TYPE_COMPLETE = "complete";
export const STATS_TYPE_PAUSED = "pause";

export const priorityColorMap = [
  "",
  "#FE7F78",
  "#FFB585",
  "#80BFFF",
  "#A4A4A4",
];

export const priorityName = ["Urgent", "High", "Medium", "Low"];

export const tagColorPalette = [
  "#AB64DF",
  "#FF8231",
  "#3E9FFF",
  "#2BB68D",
  "#EE414B",
  "#FF6990",
];

export const tagDarkerColorMap = {
  "#AB64DF": "#E4BFFF",
  "#FF8231": "#FFBC90",
  "#3E9FFF": "#E4BFFF",
  "#2BB68D": "#E4BFFF",
  "#EE414B": "#E4BFFF",
  "#FF6990": "#E4BFFF",
};

export const months = [
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

export const shortWeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const EXTENSION_ID = "agbkeeoecdaegljhmkndleobgbimfoog";

export const focusModeLSKey = "focusMode";

export const themeLSKey = "theme";

//Extension actions
export const ENABLE_FOCUS_MODE = "enableFocusMode";
export const DISABLE_FOCUS_MODE = "disableFocusMode";

//First User screen
export const FIRST_USER_KEY = "firstUserKey";

//Onboarding constants
export const LOGIN_REGISTER_STEP = 1;
export const LOGIN_STEP = 2;
export const REGISTER_STEP = 3;
export const FORGOT_PASSWORD_STEP_1 = 4;
export const FORGOT_PASSWORD_STEP_2 = 5;

//Theme constants
export const THEME_LIGHT = "light";
export const THEME_DARK = "dark";

export const PAGE_TITLE = "TimeDojo - Improve your productivity!";

export const TASK_VARIANT_TODAYS = "todays";
