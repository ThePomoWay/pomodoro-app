import { createSlice } from "@reduxjs/toolkit";
import { initialTimerState, timerReducer } from "../reducers/TimerReducer";

export const timerSlice = createSlice({
  name: "timer",
  initialState: initialTimerState,
  reducers: timerReducer,
});

export const {
  setTimerSec,
  initiateBreak,
  initiatePomo,
  pauseTimer,
  completeBreak,
  setPomoState,
  setPomoSummary,
  setTimerState,
} = timerSlice.actions;
