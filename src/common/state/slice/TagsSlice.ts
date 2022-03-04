import { createSlice } from "@reduxjs/toolkit";
import { initialTagState, tagsReducer } from "../reducers/TagsReducer";

export const tagsSlice = createSlice({
  name: "tagsSlice",
  initialState: initialTagState,
  reducers: tagsReducer,
});

export const { deleteTag, setTags, updateTag, setEditTagId, setAllTags } =
  tagsSlice.actions;
