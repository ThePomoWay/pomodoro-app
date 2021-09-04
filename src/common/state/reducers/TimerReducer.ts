import { POMO_BREAK_RUNNING_STATE, POMO_BREAK_STATE, POMO_IDLE_STATE, POMO_RUNNING_STATE } from "../../utils/constants";

export const initialTimerState = {
    timer: 25 * 60,
    defaultWorkTime: 25*60,
    defaultBreakTime: 5*60,
    completedPomos: 0,
    pomoState: POMO_IDLE_STATE,
    focusMode: false
}

export let timerReducer = {
    decrementTimer: (state) => {
        state.timer -= 1;
    },
    resetTimer: (state) => {
        state.timer = state.defaultWorkTime;
    },
    initiatePomo: (state) => {
        state.pomoState = POMO_RUNNING_STATE;
    },
    completedPomo: (state) => {
        state.timer = state.defaultBreakTime;
        state.pomoState = POMO_BREAK_STATE;
    },
    initiateBreak: (state) => {
        state.pomoState = POMO_BREAK_RUNNING_STATE;
    },
    enableFocusMode: (state) => {
        state.focusMode = true;
    },
    disableFocusMode: (state) => {
        state.focusMode = false;
    }

}