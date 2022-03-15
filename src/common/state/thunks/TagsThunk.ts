import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
import { initialTagState, tagsReducer } from "../reducers/TagsReducer";
import { deleteTag, setAllTags, updateTag } from "../slice/TagsSlice";

export const createLocalTagThunk = createAsyncThunk(
  "create/tags/local",
  async (tag, { dispatch }) => {
    dispatch(updateTag(tag));
    let response = createIDBTag(tag);
  }
);

export const createTagThunk = createAsyncThunk(
  "create/tags",
  async (tag, { dispatch }) => {
    dispatch(createLocalTagThunk(tag));

    if (AuthService.isLoggedIn()) {
      await createTagApi(tag);
    }
  }
);

export const updateTagThunk = createAsyncThunk(
  "update/tags",
  async (tag, { dispatch }) => {
    dispatch(updateTag(tag));
    let response = await updateIDBTag(tag);
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
  async (tag, { dispatch }) => {
    let response = await deleteIDBTag(tag);
    dispatch(deleteTag(tag));

    if (AuthService.isLoggedIn()) {
      await deleteTagApi(tag);
    }
  }
);
