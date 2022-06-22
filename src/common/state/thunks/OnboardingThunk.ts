import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthService from "../../API/network/AuthService";
import { getIp } from "../../API/network/SelfIpApi";
import {
  loginApi,
  registerApi,
  initiatePasswordChangeApi,
  verifyPasswordResetOTP,
  registerCheckApi,
} from "../../API/network/SignonApis";
import {
  FORGOT_PASSWORD_STEP_2,
  LOGIN_STEP,
  REGISTER_STEP,
} from "../../utils/constants";
import {
  setLoginName,
  setLoginPasswordError,
  setPasswordResetMailId,
  setRegisterEmail,
  setStep,
} from "../slice/OnboardingSlice";

export const register = createAsyncThunk(
  "global/register",
  async (obj: any, { dispatch, getState }) => {
    let state = getState()["onboarding"];
    let countryCode = await getIp()
    let response = await registerApi({
      email: state.registerEmail,
      name: obj.name,
      password: obj.password
    }, countryCode);

    if (response.data && response.data.uid) {
      AuthService.login(response.data);
    }
  }
);

export const login = createAsyncThunk(
  "global/login",
  async (obj: any, { dispatch }) => {
    let countryCode = await getIp()
    let response = await loginApi(obj, countryCode);
    if (response.status !== 200) {
      dispatch(
        setLoginPasswordError(response.data.msg || "Incorrect password")
      );
    }
    if (response.data && response.data.uid) {
      AuthService.login(response.data);
    }
  }
);

export const registerCheck = createAsyncThunk(
  "onboarding/registerCheck",
  async (email: any, { dispatch }) => {
    // replace with api call
    let response = await registerCheckApi(email);

    if (response.data && response.data.uid) {
      dispatch(setRegisterEmail(email));
      dispatch(setLoginName(response.data.name));
      dispatch(setStep(LOGIN_STEP));
    } else {
      dispatch(setRegisterEmail(email));
      dispatch(setStep(REGISTER_STEP));
    }
  }
);

export const initiatePasswordChange = createAsyncThunk(
  "forgotPassword/sendMail",
  async (obj: any, { dispatch }) => {
    let response = await initiatePasswordChangeApi(obj);
    if (response.data) {
      dispatch(setPasswordResetMailId(obj.email));
      dispatch(setStep(FORGOT_PASSWORD_STEP_2));
    }
  }
);

export const resetPassword = createAsyncThunk(
  "forgotPassword/sendMail",
  async (obj: any, { dispatch }) => {
    let response = await verifyPasswordResetOTP(obj);
    return response.data;
  }
);
