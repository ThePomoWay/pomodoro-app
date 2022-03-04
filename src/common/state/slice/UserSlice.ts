import { createSlice } from "@reduxjs/toolkit";
import { initialUserState, userReducer } from "../reducers/UserReducer";

export let userSlice = createSlice({
  name: "userSlice",
  initialState: initialUserState,
  reducers: userReducer,
});

export const { setUser } = userSlice.actions;
