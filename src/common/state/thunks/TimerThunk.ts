import { createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../serviceWorker";
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
  TAB_BREAK,
  TAB_LONG_BREAK,
} from "../../components/timer/timer-utils";
import { getTimerString } from "../../utils/common";
import {
  DEFAULT_BREAK_TIME,
  DEFAULT_LONG_BREAK_TIME,
  DEFAULT_WORK_TIME,
  PAGE_TITLE,
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
import {
  sendMessageToExtension,
  UPDATE_TIMER_ACTION,
} from "../../utils/extension-utils";
import { playAlarmSound, playTimerStartSound } from "../../utils/sound-utils";
import {
  ACTIONS_ADD_TIME,
  askPermission,
  sendWebNotification,
} from "../../utils/web-push-utils";
import { CLEAR_INTERVAL, sendWorkerMsg } from "../../utils/worker-util";
import {
  setPomoSummary,
  setTimerSec,
  setTimerState,
} from "../slice/TimerSlice";
import {
  incrementCurTaskCsec,
  incrementTaskCpomos,
  markTaskAsCurrent,
} from "./TasksThunk";

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
      let defaultTotalTime;
      if (response.pomoState.includes("long_break")) {
        defaultTotalTime =
          userPreference.defaultLongBreakTime || DEFAULT_LONG_BREAK_TIME;
      } else if (response.pomoState.includes("break")) {
        defaultTotalTime =
          userPreference.defaultBreakTime || DEFAULT_BREAK_TIME;
      } else {
        defaultTotalTime = userPreference.defaultWorkTime || DEFAULT_WORK_TIME;
      }

      if (
        response.pomoState === POMO_RUNNING_STATE ||
        response.pomoState === POMO_BREAK_RUNNING_STATE ||
        response.pomoState === POMO_LONG_BREAK_RUNNING_STATE
      ) {
        let timerInSec = getTimerInSec(
          defaultTotalTime,
          response.pomoStartTime,
          response.psec,
          response.extraSec
        );

        if (timerInSec <= 0) {
          timerInSec = 0;
          // dispatch(tickAsync());
        }
        response.timerInSec = timerInSec;
      } else if (
        response.pomoState === POMO_IDLE_STATE ||
        response.pomoState === POMO_BREAK_IDLE_STATE ||
        response.pomoState === POMO_LONG_BREAK_IDLE_STATE
      ) {
        response.timerInSec = defaultTotalTime;
      }
    }

    dispatch(setTimerState(response));
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
      date,
    };
    if (curStateObj.create) {
      response = await createTimerStateIdb(updateObj);
    } else {
      updateObj = {
        ...updateObj,
        ...curStateObj,
        date,
      };
      response = await updateTimerStateIdb(updateObj);
    }

    //@ts-ignore
    if (curStateObj && curStateObj.pomoState !== stateInStore.pomoState) {
      //@ts-ignore
      sendMessageToExtension({
        action: UPDATE_TIMER_ACTION,
        timerState: updateObj,
      });
    }

    dispatch(
      setTimerState({
        ...stateInStore,
        ...curStateObj,
        date,
      })
    );
  }
);

export let updateNextState = createAsyncThunk(
  "timer/nextstate",
  async (obj: any, { getState, dispatch }) => {
    let state = getState()["timer"];
    let userPreference = getState()["global"].userPreferences;
    if (!obj.disableAlarm) {
      playAlarmSound();
    }
    if (state.pomoState === POMO_RUNNING_STATE) {
      let pomoStartDate = getFormattedDate(state.pomoStartTime);
      let todayFormatted = getFormattedDate();

      let completedPomos = state.completedPomos + 1;
      if (pomoStartDate !== todayFormatted) {
        completedPomos = 0;
      }
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
            extraSec: 0,
          })
        );
        document.title = PAGE_TITLE;
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
            extraSec: 0,
          })
        );
      }

      // dispatch(incrementCurTaskCpomo());
    } else {
      sendWebNotification(
        "It's time for your next focused session!",
        "Start your next pomodoro session now!"
      );
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
            extraSec: 0,
          })
        );
      } else {
        dispatch(
          updateTimerState({
            pomoState: nextState,
            timerInSec: userPreference.defaultWorkTime,
            pomoSummary: {},
            extraSec: 0,
          })
        );
        document.title = PAGE_TITLE;
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

    // if (timerState.pomoState === POMO_RUNNING_STATE) {
    //   let curTaskId = taskState.currentTaskRef;
    //   if (curTaskId) {
    //     if (!pomoSummary[curTaskId]) {
    //       pomoSummary[curTaskId] = 2;
    //     } else {
    //       pomoSummary[curTaskId] += 1;
    //     }
    //   }
    // }

    let defaultTotalTime = userPreference.defaultWorkTime;

    if (timerState.pomoState.includes("long_break")) {
      defaultTotalTime = userPreference.defaultLongBreakTime;
    } else if (timerState.pomoState.includes("break")) {
      defaultTotalTime = userPreference.defaultBreakTime;
    }

    let timerSec = getTimerInSec(
      defaultTotalTime,
      timerState.pomoStartTime,
      timerState.psec,
      timerState.extraSec
    );
    if (timerSec <= 0) {
      dispatch(setTimerSec(0));
      document.title = PAGE_TITLE;

      sendWorkerMsg(CLEAR_INTERVAL);

      if (timerState.pomoState === POMO_RUNNING_STATE) {
        dispatch(completePomodoro());
      } else {
        dispatch(updateNextState({}));
      }
    } else {
      if (
        timerSec === 300 &&
        timerState.pomoState === POMO_RUNNING_STATE &&
        timerState.extraSec === 0
      ) {
        sendWebNotification(
          "5 mins more to go!",
          "Would you like to extend the duration of your Pomodoro session?",
          ACTIONS_ADD_TIME
        );
      }

      dispatch(setTimerSec(timerSec));
      // dispatch(incrementCurTaskCsec());
      dispatch(setPomoSummary(pomoSummary));
      dispatch(incrementCurTaskCsec());

      if (timerState.pomoState.includes("running")) {
        document.title = getTimerString(timerSec) + " Left";
      }
    }
  }
);

export const startWorkTimerAsync = createAsyncThunk(
  "timer/start/work",
  (_, { dispatch, getState }) => {
    let userPreference = getState()["global"].userPreferences;
    dispatch(
      updateTimerState({
        pomoStartTime: Date.now(),
        pomoState: POMO_RUNNING_STATE,
        psec: 0,
        lastResumeTime: new Date().toISOString(),
        timerInSec: userPreference.defaultWorkTime,
        extraSec: 0,
      })
    );
  }
);

export const startTimerAsync = createAsyncThunk(
  "timer/start",
  (_, { dispatch, getState }) => {
    let timerState = getState()["timer"];
    let date = new Date();
    askPermission();
    let userPreference = getState()["global"].userPreferences;
    let tab = getTab(timerState.pomoState);
    let timerInSec = userPreference.defaultWorkTime;
    if (tab === TAB_BREAK) {
      timerInSec = userPreference.defaultBreakTime;
    }
    if (tab === TAB_LONG_BREAK) {
      timerInSec = userPreference.defaultLongBreakTime;
    }
    dispatch(
      updateTimerState({
        pomoStartTime: date.getTime(),
        pomoState: actionStateMap[getTab(timerState.pomoState)].play,
        psec: 0,
        lastResumeTime: date.toISOString(),
        timerInSec,
        extraSec: 0,
      })
    );

    dispatch(markTaskAsCurrent({}));
    playTimerStartSound();
  }
);

export const pauseTimerAsync = createAsyncThunk(
  "timer/pause",
  (_, { dispatch, getState }) => {
    let timerState = getState()["timer"];
    let taskState = getState()["tasks"];
    let pomoSummary = window.structuredClone(timerState.pomoSummary);

    sendWorkerMsg(CLEAR_INTERVAL);

    let summary = [];
    for (let taskId in pomoSummary) {
      if (!pomoSummary[taskId].endTime) {
        pomoSummary[taskId].csec += Math.round(
          (Date.now() - pomoSummary[taskId].startTime) / 1000
        );
      }
      summary.push({
        tid: taskState.tasks[taskId]._id,
        fid: taskState.tasks[taskId].fid,
        csec: pomoSummary[taskId].csec,
      });
    }

    dispatch(incrementTaskCpomos(summary));

    if (AuthService.isLoggedIn()) {
      updateTimerStatsAPI(
        timerState.lastResumeTime ||
          new Date(timerState.pomoStartTime).toISOString(),
        new Date().toISOString(),
        STATS_TYPE_PAUSED,
        false,
        summary
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

    dispatch(setPomoSummary({}));
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

    playTimerStartSound();

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

    dispatch(markTaskAsCurrent({}));
  }
);

export const resetTimerAsync = createAsyncThunk(
  "timer/reset",
  (_, { dispatch, getState }) => {
    let state = getState()["timer"].pomoState;
    let userPreference = getState()["global"].userPreferences;

    sendWorkerMsg(CLEAR_INTERVAL);

    document.title = PAGE_TITLE;
    dispatch(
      updateTimerState({
        pomoState: actionStateMap[getTab(state)].stop,
        timerInSec: userPreference.defaultWorkTime,
        ptime: "",
        psec: 0,
        extraSec: 0,
      })
    );
  }
);

export const completePomodoro = createAsyncThunk(
  "timer/complete",
  async (_, { dispatch, getState }) => {
    let timerState = getState()["timer"];
    let taskState = getState()["tasks"];
    let pomoSummary = window.structuredClone(timerState.pomoSummary);

    let summary = [];
    for (let taskId in pomoSummary) {
      if (!pomoSummary[taskId].endTime) {
        pomoSummary[taskId].csec += Math.round(
          (Date.now() - pomoSummary[taskId].startTime) / 1000
        );
      }
      summary.push({
        tid: taskState.tasks[taskId]._id,
        fid: taskState.tasks[taskId].fid,
        csec: pomoSummary[taskId].csec,
      });
    }

    dispatch(incrementTaskCpomos(summary));

    let userPreference = <any>(
      await getFromCollection(
        userPreferencesObjectStoreName,
        false,
        userPreferencesObjectKey
      )
    );

    let completedTid = "";
    if (taskState.currentTaskRef) {
      completedTid =
        taskState.tasks[taskState.currentTaskRef] &&
        taskState.tasks[taskState.currentTaskRef]._id;
    }

    dispatch(updateNextState({}));

    dispatch(setPomoSummary({}));

    if (timerState.pomoState === POMO_RUNNING_STATE) {
      sendWebNotification(
        "Time to take a break!",
        "Hope you had a good focus session!",
        []
      );

      let endDate = new Date(
        timerState.pomoStartTime +
          timerState.psec * 1000 +
          timerState.extraSec * 1000 +
          (userPreference.defaultWorkTime || DEFAULT_WORK_TIME) * 1000
      );
      if (AuthService.isLoggedIn()) {
        //ToDo: add functionality for distracted.
        updateTimerStatsAPI(
          timerState.lastResumeTime ||
            new Date(timerState.pomoStartTime).toISOString(),
          endDate.toISOString(),
          STATS_TYPE_COMPLETE,
          new Date(timerState.lastResumeTime).getTime() !==
            timerState.pomoStartTime,
          summary,
          completedTid
        );
      } else {
        pushToStatsUpdateQueueIDB(
          timerState.lastResumeTime ||
            new Date(timerState.pomoStartTime).toISOString(),
          endDate.toISOString(),
          STATS_TYPE_COMPLETE,
          new Date(timerState.lastResumeTime).getTime() !==
            timerState.pomoStartTime,
          summary,
          taskState.currentTaskRef
        );
      }
    }
  }
);

export const addMinsToClock = createAsyncThunk(
  "timer/addExtraSecs",
  async (seconds, { dispatch, getState }) => {
    let timerState = getState()["timer"];
    let updateObj = {
      ...timerState,
      extraSec: seconds,
    };

    dispatch(updateTimerState(updateObj));

    sendMessageToExtension({
      action: UPDATE_TIMER_ACTION,
      timerState: updateObj,
    });
  }
);
