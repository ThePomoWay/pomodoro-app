import { createSlice } from "@reduxjs/toolkit";
import { initialTimerState, timerReducer } from "../reducers/TimerReducer";

export const timerSlice = createSlice({
    name: 'timer',
    initialState: initialTimerState,
    reducers: timerReducer
});

export const {completedPomo, decrementTimer, disableFocusMode, enableFocusMode,
initiateBreak, initiatePomo, resetTimer} = timerSlice.actions;