import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { create } from "domain";
import { createTimerStateIdb, getTimerStateFromIdb, updateTimerStateIdb } from "../../API/indexed-db-ops/timerstate";
import { DEFAULT_BREAK_TIME, DEFAULT_LONG_BREAK_TIME, DEFAULT_WORK_TIME, POMO_BREAK_IDLE_STATE, POMO_BREAK_RUNNING_STATE, POMO_IDLE_STATE, POMO_LONG_BREAK_IDLE_STATE, POMO_RUNNING_STATE } from "../../utils/constants";
import { getFormattedDate } from "../../utils/date-utils";
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
)

export let updateTimerState = createAsyncThunk(
    'timer/create/update',
    async (curStateObj: any, {getState, dispatch}) => {
        let date = getFormattedDate();
        let stateInStore = getState()['timer'];
        let response;
        if(curStateObj.create) {
            response = await createTimerStateIdb({
                ...stateInStore,
                date
            });
        }
        else {
            response = await updateTimerStateIdb({
                ...stateInStore,
                ...curStateObj,
                 date
            });
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
        if(state.pomoState === POMO_RUNNING_STATE) {
            let completedPomos = state.completedPomos + 1;
            let nextState = (completedPomos !== 0 && completedPomos % 4 == 0) ? POMO_LONG_BREAK_IDLE_STATE : POMO_BREAK_IDLE_STATE;
            let nextTimerInSec = nextState === POMO_LONG_BREAK_IDLE_STATE ? DEFAULT_LONG_BREAK_TIME : DEFAULT_BREAK_TIME;
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

export const timerSlice = createSlice({
    name: 'timer',
    initialState: initialTimerState,
    reducers: timerReducer,
    extraReducers: (builder) => {
        builder.addCase(getTimerState.fulfilled, (state, action) => {
            if(action.payload) {
                state.completedPomos = action.payload.completedPomos;
                state.pomoState = action.payload.pomoState;
                state.timerInSec = action.payload.timerInSec;
            }
        })
        .addCase(updateTimerState.fulfilled, (state, action) => {
            if(action.payload) {
                state.completedPomos = action.payload.completedPomos;
                state.pomoState = action.payload.pomoState;
                state.timerInSec = action.payload.timerInSec;
            }
        })
    }
});

export const {completedPomo, tick,
initiateBreak, initiatePomo, resetTimer, pauseTimer, completeBreak, setPomoState} = timerSlice.actions;