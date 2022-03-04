import { createSlice } from "@reduxjs/toolkit";
import {
  initialOnboardingState,
  onboardingReducer,
} from "../reducers/OnboardingReducer";

export let onboardingSlice = createSlice({
  name: "onboardingSlice",
  initialState: initialOnboardingState,
  reducers: onboardingReducer,
});

export let {
  setRegisterEmail,
  setStep,
  setPasswordResetMailId,
  setLoginName,
  setLoginPasswordError,
} = onboardingSlice.actions;
