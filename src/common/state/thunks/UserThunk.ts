import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthService from "../../API/network/AuthService";
import { getUserApi } from "../../API/network/UserApis";
import { getFormattedDate } from "../../utils/date-utils";
import { setUser } from "../slice/UserSlice";

export let getUserAsync = createAsyncThunk(
  "user/get",
  async (_, { dispatch }) => {
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
    dispatch(setUser(response.data));
  }
);
