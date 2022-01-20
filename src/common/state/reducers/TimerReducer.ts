import { POMO_BREAK_RUNNING_STATE, POMO_BREAK_IDLE_STATE, POMO_IDLE_STATE, POMO_RUNNING_STATE, POMO_PAUSED_STATE, DEFAULT_WORK_TIME, DEFAULT_BREAK_TIME, DEFAULT_LONG_BREAK_TIME } from "../../utils/constants";

export const initialTimerState = {
    timerInSec: DEFAULT_WORK_TIME,
    defaultWorkTime: DEFAULT_WORK_TIME,
    defaultBreakTime: DEFAULT_BREAK_TIME,
    defaultLongBreakTime: DEFAULT_LONG_BREAK_TIME,
    completedPomos: 0,
    pomoState: POMO_IDLE_STATE,
    autoPlayPomo: false,
    autoPlayBreak: false,
    pomoStartTime: 0,
    psec: 0,
    lastResumeTime: '',
    ptime: '',
    isClockRunning: false,
    pomoSummary: {}
}

export let timerReducer = {
    setTimerSec: (state, action) => {
        state.timerInSec = action.payload;
    },
    pauseTimer: (state) => {
        state.pomoState = POMO_PAUSED_STATE;
    },
    resetTimer: (state) => {
        state.timerInSec = state.defaultWorkTime;
        state.pomoState = POMO_IDLE_STATE;
    },
    initiatePomo: (state) => {
        state.pomoState = POMO_RUNNING_STATE;
    },
    completedPomo: (state) => {
        state.timerInSec = state.defaultBreakTime;
        state.pomoState = POMO_BREAK_IDLE_STATE;
    },
    initiateBreak: (state) => {
        state.pomoState = POMO_BREAK_RUNNING_STATE;
    },
    completeBreak: (state) => {
        state.pomoState = POMO_IDLE_STATE;
    },
    setPomoState: (state, action) => {
        state.pomoState = action.payload.state
    },

    setInitialState: (state, action) => {
        state.completedPomos = action.payload.completedPomos;
        state.pomoState = action.payload.pomoState;
    },
    setPomoSummary: (state, action) => {
        state.pomoSummary = action.payload || {};
    }
}