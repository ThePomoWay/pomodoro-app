import { createAsyncThunk } from "@reduxjs/toolkit";
import { getOriginFromUrl } from "../../utils/common";
import { sendMessageToExtension } from "../../utils/extension-utils";
import {
  setBlockedWebsites,
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
    let sites = Object.keys(obj).map((item) => {
      totalTimeSpent += obj[item];
      return {
        url: "https://" + item,
        timeSpent: obj[item],
        percent: 0,
        host: getOriginFromUrl("https://" + item),
      };
    });

    sites.forEach((item) => {
      item.percent = Math.round((item.timeSpent / totalTimeSpent) * 100);
    });

    sites.sort((a, b) => b.timeSpent - a.timeSpent);

    dispatch(setTimeTrackingObj(sites));
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
      (item) => item.url !== obj.url
    );
    sendMessageToExtension({
      action: "removeFromBlockedSites",
      data: obj,
    });

    // setBlockedWebsite(updatedBlockedSites);
    dispatch(setBlockedWebsites(updatedBlockedSites));
  }
);
