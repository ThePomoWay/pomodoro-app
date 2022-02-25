import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createIDBProject,
  deleteIDBproject,
  getAllProjectsFromIDB,
  updateIDBProject,
} from "../../API/indexed-db-ops/projectCrud";
import AuthService from "../../API/network/AuthService";
import {
  createProjectApi,
  createSectionApi,
  deleteProjectApi,
  rearrangeTaskApi,
} from "../../API/network/ProjectApis";
import { findIndex } from "../../utils/array-utils";
import { getObjFromArr } from "../../utils/common";
import { validateAPIResponse } from "../../utils/validators";
import {
  initialProjectsState,
  projectReducer,
} from "../reducers/ProjectReducer";
import { setProjectModalState, setToast } from "./GlobalSlice";
import { createLocalTaskThunk } from "./TasksSlice";

export const createLocalProjectAsync = createAsyncThunk(
  "create/project/local",
  async (obj: any, { dispatch }) => {
    dispatch(createProject(obj.project));
    let response = await createIDBProject(obj.project);
  }
);

export const createProjectAsync = createAsyncThunk(
  "create/project",
  async (obj: any, { dispatch }) => {
    if (AuthService.isLoggedIn()) {
      let response = validateAPIResponse(
        await createProjectApi(obj.project),
        dispatch,
        setToast
      );
      if (response.data.pid) {
        dispatch(
          createLocalProjectAsync({
            project: {
              ...obj.project,
              _id: response.data.pid,
            },
          })
        );

        dispatch(setProjectModalState(false));

        if (obj.redirect) {
          window.location.href = "/all/project/" + response.data.pid;
        }
      }

      // dispatch(
      //   updateProjectAsync({
      //     ...obj.project,
      //     _id: bid,
      //   })
      // );
    }

    return obj;
  }
);

export const createSectionAsync = createAsyncThunk(
  "create/section",
  async (obj: any, { dispatch }) => {
    if (AuthService.isLoggedIn()) {
      let response = await createSectionApi(obj.project, obj.section);
      if (response && response.data && response.data.secId) {
        let _id = response.data.secId;
        let sectionObj = {
          ...obj.project.sections,
          [_id]: {
            secID: _id,
            title: obj.section.title,
            to: obj.section.to,
          },
        };
        let sectionOrderCopy = JSON.parse(JSON.stringify(obj.project.so));
        sectionOrderCopy.splice(obj.section.index, 0, _id);

        dispatch(
          updateLocalProjectAsync({
            ...obj.project,
            sections: sectionObj,
            so: sectionOrderCopy,
          })
        );
      }
    }
  }
);

export const updateLocalProjectAsync = createAsyncThunk(
  "update/project",
  async (project, { dispatch }) => {
    dispatch(updateProject(project));
    let response = await updateIDBProject(project);
    return response;
  }
);

export const deleteProjectAsync = createAsyncThunk(
  "delete/project",
  async (project, { dispatch }) => {
    if (AuthService.isLoggedIn()) {
      await deleteProjectApi(project);
    }
    dispatch(deleteProject(project));
    let response = await deleteIDBproject(project);

    return response;
  }
);

export const rearrangeTaskInProjectAsync = createAsyncThunk(
  "tasks/project/rearrange",
  async (obj, { dispatch }) => {
    let response = await rearrangeTaskApi(obj);
  }
);

export const addTaskToProjectLocal = createAsyncThunk(
  "add/task/project",
  async (obj: any, { dispatch, getState }) => {
    let project = getState()["projects"].projects[obj.projectId];
    dispatch(
      updateLocalProjectAsync({
        ...project,
        to: [...project.to, obj.taskId],
      })
    );
  }
);

export const removeTaskFromProject = createAsyncThunk(
  "project/task/remove",
  async (obj: any, { dispatch, getState }) => {
    if (obj.projectId) {
      let projectsObj = getState()["projects"].projects[obj.projectId];
      if (projectsObj) {
        if (obj.sectionId) {
          if (projectsObj.sections[obj.sectionId]) {
            let toCopy = JSON.parse(
              JSON.stringify(projectsObj.sections[obj.sectionId].to)
            );
            let index = findIndex(toCopy, obj.taskId);
            toCopy.splice(index, 1);
            if (index !== -1) {
              dispatch(
                updateLocalProjectAsync({
                  ...projectsObj,
                  sections: {
                    ...projectsObj.sections,
                    [obj.sectionId]: {
                      ...projectsObj.sections[obj.sectionId],
                      to: toCopy,
                    },
                  },
                })
              );
            }
          }
        } else {
          let toCopy = JSON.parse(JSON.stringify(projectsObj.to));
          let index = findIndex(toCopy, obj.taskId);
          toCopy.splice(index, 1);
          if (index !== -1) {
            dispatch(
              updateLocalProjectAsync({
                ...projectsObj,
                to: toCopy,
              })
            );
          }
        }
      }
    }
  }
);

export const getAllProjects = createAsyncThunk(
  "get/project",
  async (_, { dispatch }) => {
    let response = getAllProjectsFromIDB();
    return response;
  }
);

export const projectSlice = createSlice({
  name: "projectSlice",
  initialState: initialProjectsState,
  reducers: projectReducer,
  extraReducers: (builder) => {
    builder
      .addCase(getAllProjects.fulfilled, (state: any, action: any) => {
        if (action.payload) {
          let pid = AuthService.getInboxProjectId();
          state.projects = getObjFromArr(action.payload, "_id", true);
          state.projectOrder = action.payload.map((i) => i._id);
        }
      })
      .addCase(createProjectAsync.fulfilled, (state: any, action: any) => {
        // if(action.payload) {
        //     window.location.href = `${action.payload.path}/${action.payload.project.fid}`;
        // }
      });
  },
});

export const { createProject, deleteProject, updateProject, setEditProjectId } =
  projectSlice.actions;
