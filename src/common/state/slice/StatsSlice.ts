import { createSlice } from "@reduxjs/toolkit";
import { initialStatsState, statsReducer } from "../reducers/StatsReducer";

export let statsSlice = createSlice({
  name: "statsSlice",
  initialState: initialStatsState,
  reducers: statsReducer,
});

export const { setAllStats } = statsSlice.actions;
