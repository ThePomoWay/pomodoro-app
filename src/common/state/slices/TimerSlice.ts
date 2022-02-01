import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { pushToStatsUpdateQueueIDB } from "../../API/indexed-db-ops/statsQueue";
import {
  createTimerStateIdb,
  getTimerStateFromIdb,
  updateTimerStateIdb,
} from "../../API/indexed-db-ops/timerstate";
import AuthService from "../../API/network/AuthService";
import { updateTimerStatsAPI } from "../../API/network/StatsApis";
import {
  DEFAULT_BREAK_TIME,
  DEFAULT_LONG_BREAK_TIME,
  DEFAULT_WORK_TIME,
  EXTENSION_ID,
  POMO_BREAK_IDLE_STATE,
  POMO_BREAK_PAUSED_STATE,
  POMO_BREAK_RUNNING_STATE,
  POMO_IDLE_STATE,
  POMO_LONG_BREAK_IDLE_STATE,
  POMO_LONG_BREAK_PAUSED_STATE,
  POMO_PAUSED_STATE,
  POMO_RUNNING_STATE,
  STATS_TYPE_COMPLETE,
  STATS_TYPE_PAUSED,
} from "../../utils/constants";
import { getFormattedDate } from "../../utils/date-utils";
import { sendMessageToExtension } from "../../utils/extension-message-utils";
import { playAlarmSound } from "../../utils/sound-utils";
import { initialTimerState, timerReducer } from "../reducers/TimerReducer";
import { incrementCurTaskCpomo, incrementCurTaskCsec } from "./TasksSlice";

export let getTimerState = createAsyncThunk(
  "timer/getState",
  async (_, { dispatch }) => {
    let formattedDate = getFormattedDate();
    let response = await getTimerStateFromIdb(formattedDate);
    if (!response) {
      dispatch(updateTimerState({ create: true }));
    }
    return response;
  }
);

export let saveDefaultTimer = createAsyncThunk(
  "timer/saveState",
  async (_, { dispatch }) => {
    let formattedDate = getFormattedDate();
    let response = await getTimerStateFromIdb(formattedDate);
  }
);

export let updateTimerState = createAsyncThunk(
  "timer/create/update",
  async (curStateObj: any, { getState, dispatch }) => {
    let date = getFormattedDate();
    let stateInStore = getState()["timer"];
    let response;

    let updateObj = {
      ...stateInStore,
      pomoDate: new Date().toISOString(),
      curTime: Date.now(),
      psec: 0,
      ptime: "",
      date,
    };
    if (curStateObj.create) {
      response = await createTimerStateIdb(updateObj);
    } else {
      updateObj = {
        ...updateObj,
        ...curStateObj,
        curTime: Date.now(),
        date,
      };
      response = await updateTimerStateIdb(updateObj);
    }

    let isExtensionPresent = getState()["global"].extensionPresent;

    //@ts-ignore
    if (
      isExtensionPresent &&
      curStateObj &&
      curStateObj.pomoState !== stateInStore.pomoState
    ) {
      //@ts-ignore
      sendMessageToExtension({
        action: "updateTimerState",
        timerState: updateObj,
      });
    }

    return {
      ...stateInStore,
      ...curStateObj,
      date,
    };
  }
);

export let updateNextState = createAsyncThunk(
  "timer/nextstate",
  async (_, { getState, dispatch }) => {
    let state = getState()["timer"];
    playAlarmSound();
    if (state.pomoState === POMO_RUNNING_STATE) {
      let completedPomos = state.completedPomos + 1;
      let nextState =
        completedPomos !== 0 && completedPomos % 4 == 0
          ? POMO_LONG_BREAK_IDLE_STATE
          : POMO_BREAK_IDLE_STATE;
      let nextTimerInSec =
        nextState === POMO_LONG_BREAK_IDLE_STATE
          ? DEFAULT_LONG_BREAK_TIME
          : DEFAULT_BREAK_TIME;

      // if(AuthService.isLoggedIn()) {
      //     updateTimerStatsAPI(new Date(state.pomoStartTime).toISOString(), new Date().toISOString(), 'complete', false);
      // }

      dispatch(
        updateTimerState({
          pomoState: nextState,
          timerInSec: nextTimerInSec,
          completedPomos,
          ptime: "",
          lastResumeTime: "",
          psec: 0,
        })
      );

      dispatch(incrementCurTaskCpomo());
    } else {
      dispatch(
        updateTimerState({
          pomoState: POMO_IDLE_STATE,
          timerInSec: DEFAULT_WORK_TIME,
        })
      );
    }
  }
);

export let tickAsync = createAsyncThunk(
  "timer/tick",
  async (_, { getState, dispatch }) => {
    let timerState = getState()["timer"];
    let taskState = getState()["tasks"];

    let pomoSummary = Object.assign({}, timerState.pomoSummary);

    let curTaskId = taskState.currentTaskRef;
    if (curTaskId) {
      if (!pomoSummary[curTaskId]) {
        pomoSummary[curTaskId] = 1;
      } else {
        pomoSummary[curTaskId] += 1;
      }
    }

    let defaultTotalTime = timerState.defaultWorkTime;

    if (timerState.pomoState.includes("long_break")) {
      defaultTotalTime = timerState.defaultLongBreakTime;
    } else if (timerState.pomoState.includes("break")) {
      defaultTotalTime = timerState.defaultBreakTime;
    }
    let diff = Math.floor(
      (Date.now() - timerState.pomoStartTime + timerState.psec) / 1000
    );

    let timerSec = defaultTotalTime - diff + timerState.psec;
    if (timerSec <= 0) {
      dispatch(setTimerSec(defaultTotalTime - diff + timerState.psec));
      dispatch(completePomodoro());
    } else {
      dispatch(setTimerSec(defaultTotalTime - diff + timerState.psec));
      // dispatch(incrementCurTaskCsec());
      dispatch(setPomoSummary(pomoSummary));
    }
  }
);

export const pauseTimerAsync = createAsyncThunk(
  "timer/pause",
  (_, { dispatch, getState }) => {
    let timerState = getState()["timer"];

    if (AuthService.isLoggedIn()) {
      updateTimerStatsAPI(
        timerState.lastResumeTime ||
          new Date(timerState.pomoStartTime).toISOString(),
        new Date().toISOString(),
        STATS_TYPE_PAUSED,
        false
      );
    }
    let nextState = POMO_PAUSED_STATE;
    if (timerState.pomoState.includes("long_break")) {
      nextState = POMO_LONG_BREAK_PAUSED_STATE;
    } else if (timerState.pomoState.includes("break")) {
      nextState = POMO_BREAK_PAUSED_STATE;
    }

    dispatch(
      updateTimerState({
        pomoState: nextState,
        ptime: new Date().toISOString(),
      })
    );
  }
);

export const resumeTimerAsync = createAsyncThunk(
  "timer/resume",
  (_, { dispatch, getState }) => {
    let timerState = getState()["timer"];

    //assumes ptime is present.
    let pausedSec =
      timerState.psec +
      Math.round((Date.now() - new Date(timerState.ptime).getTime()) / 1000);
    dispatch(
      updateTimerState({
        ...timerState,
        pomoState: POMO_RUNNING_STATE,
        psec: pausedSec,
        lastResumeTime: new Date().toISOString(),
      })
    );
  }
);

export const completePomodoro = createAsyncThunk(
  "timer/complete",
  (_, { dispatch, getState }) => {
    let timerState = getState()["timer"];
    let taskState = getState()["tasks"];
    let pomoSummary = timerState.pomoSummary;
    let summary = [];
    for (let taskId in pomoSummary) {
      summary.push({
        tid: taskState.tasks[taskId]._id,
        csec: pomoSummary[taskId],
      });
    }

    if (timerState.pomoState === POMO_RUNNING_STATE) {
      if (AuthService.isLoggedIn()) {
        //ToDo: add functionality for distracted.
        updateTimerStatsAPI(
          timerState.lastResumeTime ||
            new Date(timerState.pomoStartTime).toISOString(),
          new Date().toISOString(),
          STATS_TYPE_COMPLETE,
          false,
          summary
        );
        dispatch(setPomoSummary({}));
      } else {
        pushToStatsUpdateQueueIDB(
          timerState.lastResumeTime ||
            new Date(timerState.pomoStartTime).toISOString(),
          new Date().toISOString,
          STATS_TYPE_COMPLETE,
          false
        );
      }
    }

    dispatch(updateNextState());
  }
);

export const timerSlice = createSlice({
  name: "timer",
  initialState: initialTimerState,
  reducers: timerReducer,
  extraReducers: (builder) => {
    builder
      .addCase(getTimerState.fulfilled, (state, action) => {
        if (action.payload) {
          state.completedPomos = action.payload.completedPomos;
          state.pomoState = action.payload.pomoState;
          state.pomoStartTime = action.payload.pomoStartTime;
          state.psec = action.payload.psec;
          state.ptime = action.payload.ptime;

          let defaultTotalTime = 0;

          if (state.pomoState.includes("long_break")) {
            defaultTotalTime = state.defaultLongBreakTime;
          } else if (state.pomoState.includes("break")) {
            defaultTotalTime = state.defaultBreakTime;
          } else {
            defaultTotalTime = state.defaultWorkTime;
          }

          if (state.pomoState.includes("running")) {
            let diff = Math.floor(
              (Date.now() - action.payload.pomoStartTime) / 1000
            );
            if (diff < defaultTotalTime) {
              state.timerInSec = defaultTotalTime - diff;
            } else {
              //update next state. Maybe this should be in thunk instead
            }
          } else if (state.pomoState.includes("paused")) {
            state.timerInSec = action.payload.timerInSec;
          } else {
            state.timerInSec = defaultTotalTime;
          }
        }
      })
      .addCase(updateTimerState.fulfilled, (state, action) => {
        if (action.payload) {
          state.completedPomos = action.payload.completedPomos;
          state.pomoState = action.payload.pomoState;
          state.timerInSec = action.payload.timerInSec;
          state.pomoStartTime = action.payload.pomoStartTime;
          state.psec = action.payload.psec;
          state.ptime = action.payload.ptime;
          state.lastResumeTime = action.payload.lastResumeTime;
        }
      });
  },
});

export const {
  completedPomo,
  setTimerSec,
  initiateBreak,
  initiatePomo,
  resetTimer,
  pauseTimer,
  completeBreak,
  setPomoState,
  setPomoSummary,
} = timerSlice.actions;
