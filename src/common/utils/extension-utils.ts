import { store } from "../state/store";
import {
  pauseTimerAsync,
  resumeTimerAsync,
  startTimerAsync,
  updateNextState,
  updateTimerState,
  resetTimerAsync,
} from "../state/thunks/TimerThunk";
import { setExtensionPresent, setFocusMode } from "../state/slice/GlobalSlice";
import {
  onBlockedSitesLoad,
  onHistoryLoad,
  onTimeTrackingDetailsReceived,
} from "../state/thunks/BlockerThunk";

export const START_TIMER_ACTION = "StartTimer";
export const PAUSE_TIMER_ACTION = "PauseTimer";
export const STOP_TIMER_ACTION = "StopTimer";
export const RESUME_TIMER_ACTION = "ResumeTimer";
export const SKIP_TIMER_ACTION = "SkipTimer";
export const UPDATE_TIMER_ACTION = "UpdateTimer";

export const GET_HISTORY_ACTION = "getHistory";
export const GET_BLOCKED_SITES_ACTION = "getBlockedSites";
export const SET_FOCUS_MODE_STATE_ACTION = "setFocusMode";
export const GET_TIME_TRACKING_OBJ_ACTION = "getTimeTrackingObj";
export let isExtensionPresent = false;

export default function addExtensionListeners() {
  window.addEventListener("message", (event) => {
    if (event.data && event.data.from === "extension") {
      if (event.data.action === "updateTimerStateContentScript") {
        store.dispatch(updateTimerState(event.data.data));
      }

      if (event.data.action === "extensionPresent") {
        isExtensionPresent = true;
      }
      if (event.data.action === START_TIMER_ACTION) {
        store.dispatch(startTimerAsync());
      }
      if (event.data.action === PAUSE_TIMER_ACTION) {
        store.dispatch(pauseTimerAsync());
      }
      if (event.data.action === STOP_TIMER_ACTION) {
        store.dispatch(resetTimerAsync());
      }
      if (event.data.action === SKIP_TIMER_ACTION) {
        store.dispatch(updateNextState({ disableAlarm: true }));
      }
      if (event.data.action === RESUME_TIMER_ACTION) {
        store.dispatch(resumeTimerAsync());
      }
      if (event.data.action === UPDATE_TIMER_ACTION) {
        store.dispatch(updateTimerState(event.data.data));
      }

      if (event.data.action === GET_HISTORY_ACTION) {
        store.dispatch(onHistoryLoad(event.data.data));
      }

      if (event.data.action === GET_BLOCKED_SITES_ACTION) {
        store.dispatch(onBlockedSitesLoad(event.data.data));
      }

      if (event.data.action === SET_FOCUS_MODE_STATE_ACTION) {
        store.dispatch(setFocusMode(event.data.data));
      }

      if (event.data.action === GET_TIME_TRACKING_OBJ_ACTION) {
        store.dispatch(onTimeTrackingDetailsReceived(event.data.data));
      }
    }
  });
}

export function sendMessageToExtension(obj) {
  if (window && window.postMessage) {
    //@ts-ignore
    if (!obj) {
      obj = {};
    }
    obj.from = "website";
    window.postMessage(obj, "*");
  }
}
