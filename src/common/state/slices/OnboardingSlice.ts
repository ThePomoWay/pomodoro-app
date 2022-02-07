import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthService from "../../API/network/AuthService";
import { loginApi, registerApi, initiatePasswordChangeApi, verifyPasswordResetOTP} from "../../API/network/SignonApis";
import { initialOnboardingState, onboardingReducer } from "../reducers/OnboardingReducer";

export const register = createAsyncThunk(
    'global/register',
    async (obj: any, {dispatch, getState}) => {
        let state = getState()['onboarding'];
        let response = await registerApi({
            email: state.registerEmail,
            name: obj.name,
            password: obj.password
        });
        return response.data;
    }
);

export const login = createAsyncThunk(
    'global/login',
    async (obj: any, {dispatch}) => {
        let response = await loginApi(obj);
        return response.data;
    }
)

export const registerCheck = createAsyncThunk(
    'onboarding/registerCheck',
    async (obj: any, {dispatch}) => {
        // replace with api call
        let response = {data: null};

        if(!response.data) {
            dispatch(setRegisterEmail(obj));
            dispatch(setStep(2));
        }

    }
)

export const initiatePasswordChange = createAsyncThunk(
    'forgotPassword/sendMail',
    async (obj: any, {dispatch}) => {
        let response = await initiatePasswordChangeApi(obj);
        if (response.data) {
            dispatch(setPasswordResetMailId(obj.email))
            dispatch(setStep(4));
        }
    }
)

export const resetPassword = createAsyncThunk(
    'forgotPassword/sendMail',
    async (obj: any, {dispatch}) => {
        let response = await verifyPasswordResetOTP(obj);
        return response.data;
    }
)

export let onboardingSlice = createSlice({
    name: 'onboardingSlice',
    initialState: initialOnboardingState,
    reducers: onboardingReducer,
    extraReducers: (builder) => {
        builder.addCase(register.fulfilled, (state, action) => {
            
            if(action.payload && action.payload.uid) {
                AuthService.login(action.payload);
            }
        })
        .addCase(login.fulfilled, (state, action) => {

            if(action.payload && action.payload.uid) {
                AuthService.login(action.payload);
                
            }
        })
        .addCase(resetPassword.fulfilled, (state, action) => {

            if(action.payload && action.payload.uid) {
                AuthService.login(action.payload);   
            }
        })
    }
})

export let {setRegisterEmail, setPasswordResetMailId, setStep} = onboardingSlice.actions;