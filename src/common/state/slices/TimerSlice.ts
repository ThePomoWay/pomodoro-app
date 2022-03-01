import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFromCollection } from "../../API/indexed-db-ops/indexedDbCrudWrapper";
import {
  userPreferencesObjectKey,
  userPreferencesObjectStoreName,
} from "../../API/indexed-db-ops/init";
import { pushToStatsUpdateQueueIDB } from "../../API/indexed-db-ops/statsQueue";
import {
  createTimerStateIdb,
  getTimerStateFromIdb,
  updateTimerStateIdb,
} from "../../API/indexed-db-ops/timerstate";
import AuthService from "../../API/network/AuthService";
import { updateTimerStatsAPI } from "../../API/network/StatsApis";
import {
  actionStateMap,
  getTab,
  getTimerInSec,
} from "../../components/timer/timer-utils";
import {
  DEFAULT_BREAK_TIME,
  DEFAULT_LONG_BREAK_TIME,
  DEFAULT_WORK_TIME,
  POMO_BREAK_IDLE_STATE,
  POMO_BREAK_PAUSED_STATE,
  POMO_BREAK_RUNNING_STATE,
  POMO_IDLE_STATE,
  POMO_LONG_BREAK_IDLE_STATE,
  POMO_LONG_BREAK_PAUSED_STATE,
  POMO_LONG_BREAK_RUNNING_STATE,
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
  async (_, { dispatch, getState }) => {
    let formattedDate = getFormattedDate();
    let response = <any>await getTimerStateFromIdb(formattedDate);
    let userPreference = <any>(
      await getFromCollection(
        userPreferencesObjectStoreName,
        false,
        userPreferencesObjectKey
      )
    );
    if (!response) {
      dispatch(updateTimerState({ create: true }));
    } else {
      let defaultTotalTime = "";
      if (response.pomoState.includes("long_break")) {
        defaultTotalTime = userPreference.defaultLongBreakTime;
      } else if (response.pomoState.includes("break")) {
        defaultTotalTime = userPreference.defaultBreakTime;
      } else {
        defaultTotalTime = userPreference.defaultWorkTime;
      }

      if (
        response.pomoState === POMO_RUNNING_STATE ||
        response.pomoState === POMO_BREAK_RUNNING_STATE ||
        response.pomoState === POMO_LONG_BREAK_RUNNING_STATE
      ) {
        let timerInSec = getTimerInSec(
          defaultTotalTime,
          response.pomoStartTime,
          response.psec
        );

        if (timerInSec <= 0) {
          timerInSec = 0;
          // dispatch(tickAsync());
        }
        response.timerInSec = timerInSec;
      } else {
        response.timerInSec = defaultTotalTime;
      }
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
    let userPreference = getState()["global"].userPreferences;
    playAlarmSound();
    if (state.pomoState === POMO_RUNNING_STATE) {
      let completedPomos = state.completedPomos + 1;
      let nextState =
        completedPomos !== 0 && completedPomos % 4 == 0
          ? POMO_LONG_BREAK_IDLE_STATE
          : POMO_BREAK_IDLE_STATE;
      let nextTimerInSec =
        nextState === POMO_LONG_BREAK_IDLE_STATE
          ? userPreference.defaultLongBreakTime
          : userPreference.defaultBreakTime;

      // if(AuthService.isLoggedIn()) {
      //     updateTimerStatsAPI(new Date(state.pomoStartTime).toISOString(), new Date().toISOString(), 'complete', false);
      // }

      if (userPreference.autoplayBreak) {
        nextState =
          nextState === POMO_LONG_BREAK_IDLE_STATE
            ? POMO_LONG_BREAK_RUNNING_STATE
            : POMO_BREAK_RUNNING_STATE;

        let date = new Date();
        dispatch(
          updateTimerState({
            pomoStartTime: date.getTime(),
            pomoState: nextState,
            psec: 0,
            lastResumeTime: date.toISOString(),
            completedPomos,

            timerInSec: nextTimerInSec,

            ptime: "",
            pomoSummary: {},
          })
        );
      } else {
        dispatch(
          updateTimerState({
            pomoState: nextState,
            timerInSec: nextTimerInSec,
            completedPomos,
            ptime: "",
            lastResumeTime: "",
            psec: 0,
            pomoSummary: {},
          })
        );
      }

      dispatch(incrementCurTaskCpomo());
    } else {
      let nextState = POMO_IDLE_STATE;
      if (userPreference.autoplayPomo) {
        nextState = POMO_RUNNING_STATE;
        let date = new Date();

        dispatch(
          updateTimerState({
            pomoStartTime: date.getTime(),
            pomoState: nextState,
            psec: 0,
            lastResumeTime: date.toISOString(),
            timerInSec: userPreference.defaultWorkTime,
            ptime: "",
            pomoSummary: {},
          })
        );
      } else {
        dispatch(
          updateTimerState({
            pomoState: nextState,
            timerInSec: DEFAULT_WORK_TIME,
            pomoSummary: {},
          })
        );
      }
    }
  }
);

export let tickAsync = createAsyncThunk(
  "timer/tick",
  async (_, { getState, dispatch }) => {
    let timerState = getState()["timer"];
    let taskState = getState()["tasks"];
    let userPreference = getState()["global"].userPreferences;

    let pomoSummary = Object.assign({}, timerState.pomoSummary);

    if (timerState.pomoState === POMO_RUNNING_STATE) {
      let curTaskId = taskState.currentTaskRef;
      if (curTaskId) {
        if (!pomoSummary[curTaskId]) {
          pomoSummary[curTaskId] = 2;
        } else {
          pomoSummary[curTaskId] += 1;
        }
      }
    }

    let defaultTotalTime = userPreference.defaultWorkTime;

    if (timerState.pomoState.includes("long_break")) {
      defaultTotalTime = userPreference.defaultLongBreakTime;
    } else if (timerState.pomoState.includes("break")) {
      defaultTotalTime = userPreference.defaultBreakTime;
    }

    let timerSec = getTimerInSec(
      defaultTotalTime,
      timerState.pomoStartTime,
      timerState.psec
    );
    if (timerSec <= 0) {
      dispatch(setTimerSec(0));

      if (timerState.pomoState === POMO_RUNNING_STATE) {
        dispatch(completePomodoro());
      } else {
        dispatch(updateNextState());
      }
    } else {
      dispatch(setTimerSec(timerSec));
      // dispatch(incrementCurTaskCsec());
      dispatch(setPomoSummary(pomoSummary));
    }
  }
);

export const startTimerAsync = createAsyncThunk(
  "timer/start",
  (_, { dispatch, getState }) => {
    let timerState = getState()["timer"];
    let date = new Date();
    dispatch(
      updateTimerState({
        pomoStartTime: date.getTime(),
        pomoState: actionStateMap[getTab(timerState.pomoState)].play,
        psec: 0,
        lastResumeTime: date.toISOString(),
      })
    );
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
    } else {
      pushToStatsUpdateQueueIDB(
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
        psec: timerState.psec,
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
      (Date.now() - new Date(timerState.ptime).getTime()) / 1000;
    dispatch(
      updateTimerState({
        ...timerState,
        pomoState: actionStateMap[getTab(timerState.pomoState)].play,
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
        tid: taskState.tasks[taskId]._id || taskState.tasks[taskId].fid,
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
      } else {
        pushToStatsUpdateQueueIDB(
          timerState.lastResumeTime ||
            new Date(timerState.pomoStartTime).toISOString(),
          new Date().toISOString(),
          STATS_TYPE_COMPLETE,
          false,
          summary
        );
      }

      dispatch(setPomoSummary({}));
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
          state.lastResumeTime = action.payload.lastResumeTime;
          state.pomoSummary = action.payload.pomoSummary;

          state.timerInSec = action.payload.timerInSec;

          // if (state.pomoState.includes("running")) {
          //   let diff = Math.floor(
          //     (Date.now() - action.payload.pomoStartTime) / 1000
          //   );
          //   if (diff < defaultTotalTime) {
          //     state.timerInSec = defaultTotalTime - diff;
          //   } else {
          //     //update next state. Maybe this should be in thunk instead
          //   }
          // } else if (state.pomoState.includes("paused")) {
          //   state.timerInSec = action.payload.timerInSec;
          // } else {
          //   state.timerInSec = defaultTotalTime;
          // }
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
  setTimerSec,
  initiateBreak,
  initiatePomo,
  pauseTimer,
  completeBreak,
  setPomoState,
  setPomoSummary,
} = timerSlice.actions;
