import { createSlice } from "@reduxjs/toolkit";
import {
  initialProjectsState,
  projectReducer,
} from "../reducers/ProjectReducer";

export const projectSlice = createSlice({
  name: "projectSlice",
  initialState: initialProjectsState,
  reducers: projectReducer,
});

export const {
  createProject,
  deleteProject,
  updateProject,
  setEditProjectId,
  setAllProjects,
} = projectSlice.actions;
