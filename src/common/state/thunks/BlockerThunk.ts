import { createAsyncThunk } from "@reduxjs/toolkit";
import { getOriginFromUrl } from "../../utils/common";
import { sendMessageToExtension } from "../../utils/extension-utils";
import {
  setBlockedWebsites,
  setFocusTimeTrackingObj,
  setHistory,
  setTimeTrackingObj,
} from "../slice/BlockerSlice";

export const getHistory = createAsyncThunk(
  "blocker/getStats",
  async (_, { dispatch }) => {
    sendMessageToExtension({
      action: "getHistory",
    });
  }
);

export const onHistoryLoad = createAsyncThunk(
  "blocker/getHistory/success",
  (obj, { dispatch }) => {
    dispatch(setHistory(obj));
  }
);

export const getBlockedSites = createAsyncThunk(
  "blocker/getBlockedSites",
  async (_, { getState, dispatch }) => {
    // let response = await getBlockedWebsites();
    // return response;

    sendMessageToExtension({
      action: "getBlockedSites",
    });
  }
);

export const getTimeTrackingDetails = createAsyncThunk(
  "blocker/getTimeTrackingDetails",
  async (_, { getState, dispatch }) => {
    sendMessageToExtension({
      action: "getTodaysTimeSpent",
    });
  }
);

export const onTimeTrackingDetailsReceived = createAsyncThunk(
  "blocker/getTimeTracking/success",
  async (obj: any, { dispatch }) => {
    let totalTimeSpent = 0;
    let timeTrackObj = obj[0];
    let focusObj = obj[1];
    let totalSites = Object.keys(timeTrackObj).map((item) => {
      totalTimeSpent += timeTrackObj[item];
      return {
        url: "https://" + item,
        timeSpent: timeTrackObj[item],
        percent: 0,
        host: getOriginFromUrl("https://" + item),
      };
    });

    totalSites.forEach((item) => {
      item.percent = Math.round((item.timeSpent / totalTimeSpent) * 100);
    });

    totalSites.sort((a, b) => b.timeSpent - a.timeSpent);

    totalTimeSpent = 0;
    let focusSites = Object.keys(focusObj).map((item) => {
      totalTimeSpent += focusObj[item];
      return {
        url: "https://" + item,
        timeSpent: focusObj[item],
        percent: 0,
        host: getOriginFromUrl("https://" + item),
      };
    });

    focusSites.forEach((item) => {
      item.percent = Math.round((item.timeSpent / totalTimeSpent) * 100);
    });

    focusSites.sort((a, b) => b.timeSpent - a.timeSpent);

    dispatch(setTimeTrackingObj(totalSites));
    dispatch(setFocusTimeTrackingObj(focusSites));
  }
);

export const onBlockedSitesLoad = createAsyncThunk(
  "blocker/getBlockedSites/sucess",
  (obj, { dispatch }) => {
    dispatch(setBlockedWebsites(obj));
  }
);

export const addBlockedSite = createAsyncThunk(
  "blocker/addSite",
  async (obj, { getState, dispatch }) => {
    let blockedSites = getState()["blocker"].blockedWebsites;

    sendMessageToExtension({
      action: "addToBlockedSites",
      data: obj,
    });

    // await setBlockedWebsite([...blockedSites, { url }]);
    dispatch(setBlockedWebsites([...blockedSites, obj]));
  }
);

export const removeFromBlockedSites = createAsyncThunk(
  "blocker/removeSite",
  async (obj: any, { getState, dispatch }) => {
    let blockedSites = getState()["blocker"].blockedWebsites;
    let updatedBlockedSites = blockedSites.filter(
      (item) => item.host !== obj.host
    );
    sendMessageToExtension({
      action: "removeFromBlockedSites",
      data: obj,
    });

    // setBlockedWebsite(updatedBlockedSites);
    dispatch(setBlockedWebsites(updatedBlockedSites));
  }
);
