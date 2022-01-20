import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthService from "../../API/network/AuthService";
import { getUserApi } from "../../API/network/UserApis";
import { initialUserState, userReducer } from "../reducers/UserReducer";

export let getUserAsync = createAsyncThunk(
    'user/get',
    async (_, {dispatch}) => {
        let response = await getUserApi(AuthService.getUserId());
        dispatch(setUser(response.data));
    }
)

export let userSlice = createSlice(
    {
        name: 'userSlice',
        initialState: initialUserState,
        reducers: userReducer
    }
)

export const {setUser} = userSlice.actions;