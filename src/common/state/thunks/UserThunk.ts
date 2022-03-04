import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthService from "../../API/network/AuthService";
import { getUserApi } from "../../API/network/UserApis";
import { setUser } from "../slice/UserSlice";

export let getUserAsync = createAsyncThunk(
  "user/get",
  async (_, { dispatch }) => {
    let response = await getUserApi(AuthService.getUserId());
    dispatch(setUser(response.data));
  }
);
