import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendMessageToExtension } from "../../utils/extension-utils";
import { setBlockedWebsites, setHistory } from "../slice/BlockerSlice";

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
