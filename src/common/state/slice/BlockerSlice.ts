import { createSlice } from "@reduxjs/toolkit";
import {
  blockerReducer,
  initialBlockerState,
} from "../reducers/BlockerReducer";

export const blockerSlice = createSlice({
  name: "blocker",
  initialState: initialBlockerState,
  reducers: blockerReducer,
  extraReducers: (builder) => {
    // builder.addCase(addBlockedSite.fulfilled, (state, action) => {
    //     state.blockedWebsites = action.payload;
    // })
    // .addCase(removeFromBlockedSites.fulfilled, (state, action) => {
    //     state.blockedWebsites = action.payload;
    // });
  },
});

export const { setBlockedWebsites, setHistory } = blockerSlice.actions;
