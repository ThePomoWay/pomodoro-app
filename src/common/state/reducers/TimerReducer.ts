import { POMO_BREAK_RUNNING_STATE, POMO_BREAK_STATE, POMO_IDLE_STATE, POMO_RUNNING_STATE } from "../../utils/constants";

export const initialTimerState = {
    timerInSec: 25 * 60,
    defaultWorkTime: 25*60,
    defaultBreakTime: 5*60,
    completedPomos: 0,
    pomoState: POMO_IDLE_STATE
}

export let timerReducer = {
    tick: (state) => {
        state.timerInSec -= 1;
    },
    resetTimer: (state) => {
        state.timerInSec = state.defaultWorkTime;
    },
    initiatePomo: (state) => {
        state.pomoState = POMO_RUNNING_STATE;
    },
    completedPomo: (state) => {
        state.timerInSec = state.defaultBreakTime;
        state.pomoState = POMO_BREAK_STATE;
    },
    initiateBreak: (state) => {
        state.pomoState = POMO_BREAK_RUNNING_STATE;
    }

}