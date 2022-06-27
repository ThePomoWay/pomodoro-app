import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { clearIDB } from "../../API/indexed-db-ops/crud";
import {
  getFromCollection,
  updateCollectionIdb,
} from "../../API/indexed-db-ops/indexedDbCrudWrapper";
import {
  userPreferencesObjectKey,
  userPreferencesObjectStoreName,
} from "../../API/indexed-db-ops/init";
import AuthService from "../../API/network/AuthService";
import { NetworkService } from "../../API/network/NetworkService";
import { facebookLoginApi, googleLoginApi } from "../../API/network/SignonApis";
import {
  getAllProducts,
  createCheckoutSession,
  createBillingConfiguration,
} from "../../API/network/PricingApis";
import {
  DISABLE_FOCUS_MODE,
  ENABLE_FOCUS_MODE,
  FIRST_USER_KEY,
  focusModeLSKey,
  POMO_BREAK_IDLE_STATE,
  POMO_IDLE_STATE,
  POMO_LONG_BREAK_IDLE_STATE,
  themeLSKey,
  THEME_DARK,
  PROJECT_COMPLETED_TASK_HIDE,
  TODAYS_COMPLETED_TASK_HIDE,
  THEME_LIGHT,
} from "../../utils/constants";
import {
  isExtensionPresent,
  sendMessageToExtension,
  SYNC_USER_PREF,
  UPDATE_TIMER_ACTION,
} from "../../utils/extension-utils";
import {
  setFocusMode,
  setHideProjectsCompletedTasks,
  setHideTodaysCompletedTasks,
  setProducts,
  setShowFirstUserState,
  setTheme,
  setUserPreferences,
  showSuccessToast,
} from "../slice/GlobalSlice";
import { setTimerSec } from "../slice/TimerSlice";
import { updateUserApi } from "../../API/network/UserApis";
import { getIp } from "../../API/network/SelfIpApi";

export let init = createAsyncThunk("global/init", async (_, { dispatch }) => {
  dispatch(
    setShowFirstUserState(localStorage.getItem(FIRST_USER_KEY) === "true")
  );

  dispatch(setTheme(localStorage.getItem(themeLSKey) || THEME_LIGHT));

  dispatch(
    setHideTodaysCompletedTasks(
      localStorage.getItem(TODAYS_COMPLETED_TASK_HIDE) === "true"
    )
  );

  dispatch(
    setHideProjectsCompletedTasks(
      localStorage.getItem(PROJECT_COMPLETED_TASK_HIDE) === "true"
    )
  );

  let defaults = await getFromCollection(
    userPreferencesObjectStoreName,
    false,
    userPreferencesObjectKey
  );
  dispatch(setUserPreferences(defaults));
});

export let hideFirstUserScreen = createAsyncThunk(
  "global/hideFirst",
  (_, { dispatch }) => {
    dispatch(setShowFirstUserState(true));
    localStorage.setItem(FIRST_USER_KEY, "true");
  }
);

export let updateFocusModeState = createAsyncThunk(
  "global/focusmode/enable",
  (val, { dispatch }) => {
    if (window && window.postMessage) {
      //@ts-ignore
      window.postMessage(
        {
          action: "updateFocusModeState",
          data: val,
        },
        "*"
      );
    }
  }
);

export const signin = createAsyncThunk(
  "global/signin",
  async (obj: any, { dispatch }) => {
    let response;
    let countryCode = await getIp()
    if (obj.mode === "google") {
      response = await googleLoginApi(obj.data, countryCode);
    } else if (obj.mode === "facebook") {
      response = await facebookLoginApi(obj.data, countryCode);
    }

    if (response.data && response.data.uid) {
      AuthService.login(response.data);
    }
  }
);

export const clearAllData = createAsyncThunk(
  "global/deleteall",
  async (_, { dispatch }) => {
    await clearIDB();
    window.location.reload();
  }
);

export const logout = createAsyncThunk(
  "global/logout",
  async (_, { dispatch }) => {
    await clearIDB();
    NetworkService.logout();
  }
);

export const extensionSyncAll = createAsyncThunk(
  "global/extension/sync",
  async (_, { dispatch, getState }) => {
    let timerState = getState()["timer"];
    let userPreferences = getState()["global"].userPreferences;

    sendMessageToExtension({
      action: SYNC_USER_PREF,
      data: userPreferences,
    });
    sendMessageToExtension({
      action: UPDATE_TIMER_ACTION,
      timerState: timerState,
    });
  }
);

export const focusModeToggle = createAsyncThunk(
  "global/focus/toggle",
  async (value: any, { dispatch, getState }) => {
    localStorage.setItem(focusModeLSKey, value);
    dispatch(setFocusMode(value));

    if (isExtensionPresent) {
      sendMessageToExtension({
        action: value ? ENABLE_FOCUS_MODE : DISABLE_FOCUS_MODE,
      });
    }
  }
);

export const updateUserPrefLocal = createAsyncThunk(
  "global/settings/update/local",
  async (updateObj: any, { dispatch, getState }) => {
    let timerState = getState()["timer"];
    await updateCollectionIdb(userPreferencesObjectStoreName, {
      key: userPreferencesObjectKey,
      ...updateObj,
    });

    sendMessageToExtension({
      action: SYNC_USER_PREF,
      data: updateObj,
    });
    dispatch(setUserPreferences(updateObj));

    if (timerState.pomoState === POMO_IDLE_STATE) {
      dispatch(setTimerSec(updateObj.defaultWorkTime));
    }
    if (timerState.pomoState === POMO_BREAK_IDLE_STATE) {
      dispatch(setTimerSec(updateObj.defaultBreakTime));
    }
    if (timerState.pomoState === POMO_LONG_BREAK_IDLE_STATE) {
      dispatch(setTimerSec(updateObj.defaultLongBreakTime));
    }
  }
);

export const updateUserPref = createAsyncThunk(
  "global/settings/update",
  async (obj: any, { dispatch, getState }) => {
    let userPreferences = getState()["global"].userPreferences;

    let user = getState()["user"].user;

    let updateObj = { ...userPreferences, ...obj };

    let resp = await updateUserApi({ ...user, settings: { clock: updateObj } });

    dispatch(showSuccessToast("Settings updated Successfully"));
    dispatch(updateUserPrefLocal(updateObj));
  }
);

export const toggleHideTodaysCompletedTasks = createAsyncThunk(
  "global/todays/hideCompleted",
  (_, { dispatch, getState }) => {
    let hideTodaysCompletedTasks =
      getState()["global"].hideTodaysCompletedTasks;

    //@ts-ignore
    localStorage.setItem(TODAYS_COMPLETED_TASK_HIDE, !hideTodaysCompletedTasks);

    dispatch(setHideTodaysCompletedTasks(!hideTodaysCompletedTasks));
  }
);

export const toggleHideProjectsCompletedTasks = createAsyncThunk(
  "global/todays/hideCompleted",
  (_, { dispatch, getState }) => {
    let hideProjectCompletedTasks =
      getState()["global"].hideProjectCompletedTasks;

    //@ts-ignore
    localStorage.setItem(
      PROJECT_COMPLETED_TASK_HIDE,
      !hideProjectCompletedTasks
    );

    dispatch(setHideProjectsCompletedTasks(!hideProjectCompletedTasks));
  }
);

export const getProducts = createAsyncThunk(
  "global/products",
  async (_, { dispatch, getState }) => {
    let resp = await getAllProducts();

    dispatch(setProducts(resp.data.products));
  }
);

export const getBillingConfiguration = createAsyncThunk(
  "global/bill-config",
  async (_, {}) => {
    let resp = await createBillingConfiguration();

    if (resp.data.url) {
      window.open(resp.data.url);
    }
  }
)

export const buyProductThunk = createAsyncThunk(
  "global/buy/product",
  async (product, { dispatch }) => {
    let resp = await createCheckoutSession(product.stripeID);

    if (resp.data.url) {
      window.open(resp.data.url);
    }
  }
);
