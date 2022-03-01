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
import { facebookLoginApi, googleLoginApi } from "../../API/network/SignonApis";
import {
  DISABLE_FOCUS_MODE,
  ENABLE_FOCUS_MODE,
  FIRST_USER_KEY,
  focusModeLSKey,
} from "../../utils/constants";
import { sendMessageToExtension } from "../../utils/extension-message-utils";
import { globalReducer, initialGlobalState } from "../reducers/GlobalReducer";

export let init = createAsyncThunk("global/init", async (_, { dispatch }) => {
  dispatch(
    setShowFirstUserState(localStorage.getItem(FIRST_USER_KEY) === "true")
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
    if (obj.mode === "google") {
      response = await googleLoginApi(obj.data);
    } else if (obj.mode === "facebook") {
      response = await facebookLoginApi(obj.data);
    }

    return response.data;
  }
);

export const logout = createAsyncThunk(
  "global/logout",
  async (_, { dispatch }) => {
    await clearIDB();
    AuthService.logout();
  }
);

export const focusModeToggle = createAsyncThunk(
  "global/focus/toggle",
  async (value: any, { dispatch, getState }) => {
    localStorage.setItem(focusModeLSKey, value);
    dispatch(setFocusMode(value));

    let isExtensionPresent = getState()["global"].extensionPresent;

    if (isExtensionPresent) {
      sendMessageToExtension({
        action: value ? ENABLE_FOCUS_MODE : DISABLE_FOCUS_MODE,
      });
    }
  }
);

export const updateUserPref = createAsyncThunk(
  "global/settings/update",
  async (obj: any, { dispatch, getState }) => {
    let userPreferences = getState()["global"].userPreferences;
    let updateObj = { ...userPreferences, ...obj };
    await updateCollectionIdb(userPreferencesObjectStoreName, {
      key: userPreferencesObjectKey,
      ...updateObj,
    });
    dispatch(showSuccessToast(obj.msg || "Settings updated Successfully"));
    dispatch(setUserPreferences(updateObj));
  }
);

export const globalSlice = createSlice({
  name: "global",
  initialState: initialGlobalState,
  reducers: globalReducer,
  extraReducers: (builder) => {
    builder.addCase(signin.fulfilled, (state, action) => {
      if (action.payload && action.payload.uid) {
        AuthService.login(action.payload);
      }
    });
  },
});

export const {
  showAddTaskBtn,
  hideAddTaskBtn,
  editTask,
  clearTaskToBeEdited,
  setExtensionPresent,
  openOnboardingModal,
  closeOnboardingModal,
  setFocusMode,
  setProjectModalState,
  setLabelModalState,
  setShowFirstUserState,
  setToast,
  showSuccessToast,
  setTheme,
  setUserPreferences,
  setLastAllTaskUrl,
} = globalSlice.actions;
