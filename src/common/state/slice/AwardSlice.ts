import { createSlice } from "@reduxjs/toolkit";
import { awardsReducer, initialRewardState } from "../reducers/AwardReducer";

export const AwardSlice = createSlice({
  name: "blocker",
  initialState: initialRewardState,
  reducers: awardsReducer,
});

export const { showAwardsModal, hideAwardsModal } = AwardSlice.actions;
