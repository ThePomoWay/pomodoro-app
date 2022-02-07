import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthService from "../../API/network/AuthService";
import { loginApi, registerApi } from "../../API/network/SignonApis";
import {
  initialOnboardingState,
  onboardingReducer,
} from "../reducers/OnboardingReducer";

export const register = createAsyncThunk(
  "global/register",
  async (obj: any, { dispatch, getState }) => {
    let state = getState()["onboarding"];
    let response = await registerApi({
      email: state.registerEmail,
      name: obj.name,
      password: obj.password,
    });
    return response.data;
  }
);

export const login = createAsyncThunk(
  "global/login",
  async (obj: any, { dispatch }) => {
    let response = await loginApi(obj);
    return response.data;
  }
);

export const registerCheck = createAsyncThunk(
  "onboarding/registerCheck",
  async (email: any, { dispatch }) => {
    // replace with api call
    let response = { data: null };

    if (!response.data) {
      dispatch(setRegisterEmail(email));
      dispatch(setStep(2));
    }
  }
);

export let onboardingSlice = createSlice({
  name: "onboardingSlice",
  initialState: initialOnboardingState,
  reducers: onboardingReducer,
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        if (action.payload && action.payload.uid) {
          AuthService.login(action.payload);
        }
      })
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload && action.payload.uid) {
          AuthService.login(action.payload);
        }
      });
  },
});

export let { setRegisterEmail, setStep } = onboardingSlice.actions;
