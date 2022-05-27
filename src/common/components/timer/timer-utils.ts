import {
  POMO_BREAK_IDLE_STATE,
  POMO_BREAK_PAUSED_STATE,
  POMO_BREAK_RUNNING_STATE,
  POMO_IDLE_STATE,
  POMO_LONG_BREAK_IDLE_STATE,
  POMO_LONG_BREAK_PAUSED_STATE,
  POMO_LONG_BREAK_RUNNING_STATE,
  POMO_PAUSED_STATE,
  POMO_RUNNING_STATE,
} from "../../utils/constants";

export const TAB_POMODORO = "pomodoro";
export const TAB_BREAK = "break";
export const TAB_LONG_BREAK = "long_break";

export const actionStateMap = {
  pomodoro: {
    pause: POMO_PAUSED_STATE,
    play: POMO_RUNNING_STATE,
    stop: POMO_IDLE_STATE,
  },
  break: {
    pause: POMO_BREAK_PAUSED_STATE,
    play: POMO_BREAK_RUNNING_STATE,
    stop: POMO_BREAK_IDLE_STATE,
  },
  long_break: {
    pause: POMO_LONG_BREAK_PAUSED_STATE,
    play: POMO_LONG_BREAK_RUNNING_STATE,
    stop: POMO_LONG_BREAK_IDLE_STATE,
  },
};

export function getTab(state) {
  if (state.startsWith("pomo_break")) {
    return TAB_BREAK;
  }

  if (state.startsWith("pomo_long_break")) {
    return TAB_LONG_BREAK;
  }
  return TAB_POMODORO;
}

export function getTimerInSec(defaultTotalTime, pomoStartTime, psec, extraSec) {
  let diff = (Date.now() - pomoStartTime) / 1000;

  return Math.ceil(defaultTotalTime - diff + psec + extraSec);
}
