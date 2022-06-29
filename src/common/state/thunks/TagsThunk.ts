import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createIDBTag,
  deleteIDBTag,
  getAllTagsFromIDB,
  updateIDBTag,
} from "../../API/indexed-db-ops/tagsCrud";
import AuthService from "../../API/network/AuthService";
import {
  createTagApi,
  deleteTagApi,
  updateTagApi,
} from "../../API/network/TagsApis";
import { showErrorToast } from "../slice/GlobalSlice";
import { deleteTag, setAllTags, updateTag } from "../slice/TagsSlice";

export const createLocalTagThunk = createAsyncThunk(
  "create/tags/local",
  async (tag: any, { dispatch }) => {
    dispatch(updateTag(tag));
    createIDBTag(tag);
  }
);

export const createTagThunk = createAsyncThunk(
  "create/tags",
  async (tag: any, { dispatch }) => {
    if (AuthService.isLoggedIn()) {
      let response = await createTagApi(tag);

      if (!response) {
        dispatch(
          showErrorToast("Unable to create tag, please try again in some time")
        );
        return;
      }
      if (response.status !== 200) {
        dispatch(showErrorToast(response.data.message));
        return;
      }
      dispatch(createLocalTagThunk({ ...tag, _id: response.data.lid }));
    } else {
      dispatch(showErrorToast("You need to be logged in to create a Label"));
    }
  }
);

export const updateTagThunk = createAsyncThunk(
  "update/tags",
  async (tag, { dispatch }) => {
    dispatch(updateTag(tag));
    await updateIDBTag(tag);
    if (AuthService.isLoggedIn()) {
      await updateTagApi(tag);
    }
  }
);

export const getAllTags = createAsyncThunk(
  "get/tags",
  async (tag, { dispatch }) => {
    let response = await getAllTagsFromIDB();
    dispatch(setAllTags(response));
  }
);

export const deleteTagThunk = createAsyncThunk(
  "delete/tags",
  async (tag: any, { dispatch }) => {
    if (AuthService.isLoggedIn()) {
      let response = await deleteTagApi(tag._id);
      if (!response) {
        dispatch(showErrorToast("Please try again in some time"));
        return;
      }
      if (response.status !== 200) {
        dispatch(showErrorToast(response.data.message));
        return;
      }
    }
    await deleteIDBTag(tag);
    dispatch(deleteTag(tag));

    window.location.href = "/all";
  }
);
