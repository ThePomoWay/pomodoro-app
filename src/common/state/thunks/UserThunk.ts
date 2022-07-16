import { createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../../API/network/AuthService";
import { getUserApi, updateUserApi } from "../../API/network/UserApis";
import {
  SUBSCRIPTION_STATUS_ACTIVE,
  SUBSCRIPTION_STATUS_PAST_DUE,
} from "../../utils/constants";
import { getFormattedDate } from "../../utils/date-utils";
import { showErrorToast, showSuccessToast } from "../slice/GlobalSlice";
import { setUser } from "../slice/UserSlice";
import { updateUserPrefLocal } from "./GlobalThunk";

export let getUserAsync = createAsyncThunk(
  "user/get",
  async (_, { dispatch, getState }) => {
    let response = await getUserApi(AuthService.getUserId());
    if (
      response &&
      response.data &&
      response.data.overallStat &&
      response.data.overallStat.rs
    ) {
      let today: any = new Date();
      let yesterday: any = new Date().setDate(today.getDate() - 1);
      today = getFormattedDate(today);
      yesterday = getFormattedDate(yesterday);

      if (
        response.data.overallStat.rs.ld !== today &&
        response.data.overallStat.rs.ld !== yesterday
      ) {
        response.data.overallStat.rs.length = 0;
      }
    }
    if (response.data && !response.data.image) {
      response.data.image = "/dp/1.jpg";
    }
    if (
      response &&
      response.data &&
      response.data.settings &&
      response.data.settings.clock &&
      response.data.settings.clock.defaultWorkTime !== 0
    ) {
      // dispatch(updateUserPrefLocal(response.data.settings.clock));
    }
    dispatch(setUser(response.data));
  }
);

export const updateUserThunk = createAsyncThunk(
  "user/update",
  async (newUser: any, { dispatch, getState }) => {
    let oldUser = getState()["user"].user;
    let obj = {
      ...oldUser,
      ...newUser,
    };
    let response = await updateUserApi(obj);
    if (!response) {
      dispatch(showErrorToast("Please check your internet"));
    } else if (response.status !== 200) {
      dispatch(showErrorToast(response.data.message));
    } else {
      dispatch(showSuccessToast("Updated Successfully!"));
      dispatch(setUser(obj));
    }
  }
);
