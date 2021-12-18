import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthService from "../../API/network/AuthService";
import { googleLoginApi } from "../../API/network/SignonApis";
import { globalReducer, initialGlobalState } from "../reducers/GlobalReducer";

export let updateFocusModeState = createAsyncThunk(
    'global/focusmode/enable',
    (val, {dispatch}) => {
        if(window && window.postMessage) {
            //@ts-ignore
            window.postMessage({
                action: 'updateFocusModeState',
                data: val
            }, '*');
        }

    }
)

function signinSuccess (value) {
    AuthService.setAuthToken(value.auth);
    AuthService.setUserId(value.uid);
}

export const signin = createAsyncThunk(
    'global/signin',
    async (obj: any, {dispatch}) => {
        if(obj.mode === 'google') {
            await googleLoginApi(obj.data).then(signinSuccess);
        }
        else if(obj.mode === 'fb') {

        }
        else if(obj.mode === 'email') {

        }
    }
)

export const register = createAsyncThunk(
    'global/register',
    (obj: any, {dispatch}) => {
        if(obj.mode === 'email') {

        }
    }
);


export const globalSlice = createSlice({
    name: 'global',
    initialState: initialGlobalState,
    reducers: globalReducer
});

export const { showAddTaskBtn, 
    hideAddTaskBtn, editTask, clearTaskToBeEdited,
    setExtensionPresent} = globalSlice.actions