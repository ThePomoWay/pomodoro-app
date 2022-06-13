import {
  DEFAULT_WORK_TIME,
  POMO_BREAK_RUNNING_STATE,
  POMO_IDLE_STATE,
  POMO_PAUSED_STATE,
  POMO_RUNNING_STATE,
} from "../../utils/constants";

export const initialTimerState = {
  timerInSec: DEFAULT_WORK_TIME,
  completedPomos: 0,
  pomoState: POMO_IDLE_STATE,
  pomoStartTime: 0,
  psec: 0,
  lastResumeTime: "",
  ptime: "",
  isClockRunning: false,
  pomoSummary: {},
  extraSec: 0,
};

export let timerReducer = {
  setTimerSec: (state, action) => {
    state.timerInSec = action.payload;
  },
  pauseTimer: (state) => {
    state.pomoState = POMO_PAUSED_STATE;
  },

  initiatePomo: (state) => {
    state.pomoState = POMO_RUNNING_STATE;
  },

  initiateBreak: (state) => {
    state.pomoState = POMO_BREAK_RUNNING_STATE;
  },
  completeBreak: (state) => {
    state.pomoState = POMO_IDLE_STATE;
  },
  setPomoState: (state, action) => {
    state.pomoState = action.payload.state;
  },

  setInitialState: (state, action) => {
    state.completedPomos = action.payload.completedPomos;
    state.pomoState = action.payload.pomoState;
  },
  setPomoSummary: (state, action) => {
    state.pomoSummary = action.payload || {};
  },

  setTimerState: (state, action) => {
    if (action.payload) {
      state.completedPomos = action.payload.completedPomos;
      state.pomoState = action.payload.pomoState;
      state.pomoStartTime = action.payload.pomoStartTime;
      state.psec = action.payload.psec;
      state.ptime = action.payload.ptime;
      state.lastResumeTime = action.payload.lastResumeTime;
      state.pomoSummary = action.payload.pomoSummary;

      state.timerInSec = action.payload.timerInSec;
      state.extraSec = action.payload.extraSec;
    }

    // if (state.pomoState.includes("running")) {
    //   let diff = Math.floor(
    //     (Date.now() - action.payload.pomoStartTime) / 1000
    //   );
    //   if (diff < defaultTotalTime) {
    //     state.timerInSec = defaultTotalTime - diff;
    //   } else {
    //     //update next state. Maybe this should be in thunk instead
    //   }
    // } else if (state.pomoState.includes("paused")) {
    //   state.timerInSec = action.payload.timerInSec;
    // } else {
    //   state.timerInSec = defaultTotalTime;
    // }
  },
};
