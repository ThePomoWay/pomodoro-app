import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createTimerStateIdb, getTimerStateFromIdb, updateTimerStateIdb } from "../../API/indexed-db-ops/timerstate";
import AuthService from "../../API/network/AuthService";
import { updateTimerStatsAPI } from "../../API/network/StatsApis";
import { DEFAULT_BREAK_TIME, DEFAULT_LONG_BREAK_TIME, DEFAULT_WORK_TIME, EXTENSION_ID, POMO_BREAK_IDLE_STATE, POMO_BREAK_RUNNING_STATE, POMO_IDLE_STATE, POMO_LONG_BREAK_IDLE_STATE, POMO_RUNNING_STATE } from "../../utils/constants";
import { getFormattedDate } from "../../utils/date-utils";
import { playAlarmSound } from "../../utils/sound-utils";
import { initialTimerState, timerReducer } from "../reducers/TimerReducer";
import { incrementCurTaskCpomo } from "./TasksSlice";

export let getTimerState = createAsyncThunk(
    'timer/getState',
    async (_, { dispatch }) => {
        let formattedDate = getFormattedDate();
        let response = await getTimerStateFromIdb(formattedDate);
        if(!response) {
            dispatch(updateTimerState({create: true}));
        }
        return response;

    }
);

export let saveDefaultTimer = createAsyncThunk(
    'timer/saveState',
    async (_, { dispatch }) => {
        let formattedDate = getFormattedDate();
        let response = await getTimerStateFromIdb(formattedDate);
    }
);

export let updateTimerState = createAsyncThunk(
    'timer/create/update',
    async (curStateObj: any, {getState, dispatch}) => {
        let date = getFormattedDate();
        let stateInStore = getState()['timer'];
        let response;

        let updateObj = {
            ...stateInStore,
            pomoDate: new Date().toISOString(),
            curTime: Date.now(),
            date
        };
        if(curStateObj.create) {
            response = await createTimerStateIdb(updateObj);
        }
        else {
            updateObj = {
                ...updateObj,
                ...curStateObj,
                curTime: Date.now(),
                 date
            }
            response = await updateTimerStateIdb(updateObj);
        }

        //@ts-ignore
        if(window && window.postMessage && curStateObj && curStateObj.pomoState !== stateInStore.pomoState) {
            //@ts-ignore
            window.postMessage({
                action: 'updateTimerState',
                timerState: updateObj
            }, '*');
        }
        
        return {
            ...stateInStore,
            ...curStateObj,
             date
        };
    }
)

export let updateNextState = createAsyncThunk(
    'timer/nextstate',
    async (_, {getState, dispatch}) => {
        let state = getState()['timer'];
        playAlarmSound();
        if(state.pomoState === POMO_RUNNING_STATE) {
            let completedPomos = state.completedPomos + 1;
            let nextState = (completedPomos !== 0 && completedPomos % 4 == 0) ? POMO_LONG_BREAK_IDLE_STATE : POMO_BREAK_IDLE_STATE;
            let nextTimerInSec = nextState === POMO_LONG_BREAK_IDLE_STATE ? DEFAULT_LONG_BREAK_TIME : DEFAULT_BREAK_TIME;
            
            if(AuthService.isLoggedIn()) {
                updateTimerStatsAPI(new Date(state.pomoStartTime).toISOString(), new Date().toISOString(), 'complete', false);
            }

            dispatch(updateTimerState({
                pomoState: nextState,
                timerInSec: nextTimerInSec,
                completedPomos
            }));

            dispatch(incrementCurTaskCpomo());
        }
        else {
            dispatch(updateTimerState({
                pomoState: POMO_IDLE_STATE,
                timerInSec: DEFAULT_WORK_TIME
            }))
        }
    }
)

export let tickAsync = createAsyncThunk(
    'timer/tick',
    async (_, {getState, dispatch}) => {
        let timerState = getState()['timer'];

        let defaultTotalTime = timerState.defaultWorkTime;

        if(timerState.pomoState.includes('long_break')) {
            defaultTotalTime = timerState.defaultLongBreakTime;
        }
        else if(timerState.pomoState.includes('break')) {
            defaultTotalTime = timerState.defaultBreakTime;
        }
        let diff = Math.floor((Date.now() - timerState.pomoStartTime)/1000);
        if(diff <= (defaultTotalTime+2)){
            dispatch(setTimerSec(defaultTotalTime - diff));
        }
        
    }
)

export const timerSlice = createSlice({
    name: 'timer',
    initialState: initialTimerState,
    reducers: timerReducer,
    extraReducers: (builder) => {
        builder.addCase(getTimerState.fulfilled, (state, action) => {
            if(action.payload) {
                state.completedPomos = action.payload.completedPomos;
                state.pomoState = action.payload.pomoState;
                state.pomoStartTime = action.payload.pomoStartTime;

                let defaultTotalTime = 0;

                if(state.pomoState.includes('long_break')) {
                    defaultTotalTime = state.defaultLongBreakTime;
                }
                else if(state.pomoState.includes('break')) {
                    defaultTotalTime = state.defaultBreakTime;
                }
                else {
                    defaultTotalTime = state.defaultWorkTime;
                }

                if(state.pomoState.includes('running')) {
                    let diff = Math.floor((Date.now() - action.payload.pomoStartTime)/1000);
                    if(diff < defaultTotalTime){
                        state.timerInSec = defaultTotalTime - diff;
                    }
                    else {
                        //update next state. Maybe this should be in thunk instead
                    }
                }
                else if(state.pomoState.includes('paused')) {
                    state.timerInSec = action.payload.timerInSec;
                }
                else{
                    state.timerInSec = defaultTotalTime;
                }
            }
        })
        .addCase(updateTimerState.fulfilled, (state, action) => {
            if(action.payload) {
                state.completedPomos = action.payload.completedPomos;
                state.pomoState = action.payload.pomoState;
                state.timerInSec = action.payload.timerInSec;
                state.pomoStartTime = action.payload.pomoStartTime;
            }
        })
    }
});

export const {completedPomo, setTimerSec,
initiateBreak, initiatePomo, resetTimer, pauseTimer, completeBreak, setPomoState} = timerSlice.actions;