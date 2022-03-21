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
  deleteSectionApi,
  rearrangeTaskApi,
  updateProjectApi,
} from "../../API/network/ProjectApis";
import { findIndex } from "../../utils/array-utils";
import { getObjFromArr } from "../../utils/common";
import { validateAPIResponse } from "../../utils/validators";
import {
  initialProjectsState,
  projectReducer,
} from "../reducers/ProjectReducer";
import {
  createProject,
  deleteProject,
  setAllProjects,
  updateProject,
} from "../slice/ProjectSlice";
import {
  setProjectModalState,
  setToast,
  showErrorToast,
  showSuccessToast,
} from "../slice/GlobalSlice";
import { createLocalTaskThunk, removeFromTodaysTaskLocal } from "./TasksThunk";
import { deleteTask, removeFromCompletedTasks } from "../slice/TasksSlice";
import { deleteIDBTask } from "../../API/indexed-db-ops/crud";

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
  "update/project/local",
  async (project, { dispatch }) => {
    dispatch(updateProject(project));
    let response = await updateIDBProject(project);
    return response;
  }
);

export const updateProjectAsync = createAsyncThunk(
  "update/project",
  async (project, { dispatch }) => {
    let response = await updateProjectApi({
      _id: project._id,
      so: project.so,
      title: project.title,
    });
    if (!response) {
      dispatch(showErrorToast("Please try again in some time"));
    } else if (response.status !== 200) {
      dispatch(
        showErrorToast(response.data.message || "Please try again in some time")
      );
    } else {
      dispatch(updateLocalProjectAsync(project));
    }
  }
);

export const deleteProjectLocal = createAsyncThunk(
  "delete/project/local",
  async (project: any, { dispatch, getState }) => {
    dispatch(deleteProject(project));
    await deleteIDBproject(project);

    //delete tasks in project and remove them from todays and completed list.

    let todaysTasks = getState()["tasks"].todaysTasks;
    let completedTasks = getState()["tasks"].todaysCompletedTasks;
    let tasks = getState()["tasks"].tasks;

    for (let taskId of todaysTasks) {
      if (tasks[taskId] && tasks[taskId].project.projectID === project._id) {
        dispatch(
          removeFromTodaysTaskLocal({
            fid: taskId,
            _id: tasks[taskId]._id,
          })
        );
      }
    }

    for (let taskId of completedTasks) {
      if (tasks[taskId] && tasks[taskId].project.projectID === project._id) {
        dispatch(
          removeFromCompletedTasks({
            fid: taskId,
            _id: tasks[taskId]._id,
          })
        );
      }
    }

    for (let sectionId of project.so) {
      if (project.sections[sectionId]) {
        for (let taskId of project.sections[sectionId].to) {
          dispatch(deleteTask({ fid: taskId }));
          await deleteIDBTask({ fid: taskId });
        }
      }
    }

    for (let taskId of project.to) {
      dispatch(deleteTask({ fid: taskId }));
      await deleteIDBTask({ fid: taskId });
    }
  }
);

export const deleteProjectAsync = createAsyncThunk(
  "delete/project",
  async (project, { dispatch }) => {
    if (AuthService.isLoggedIn()) {
      let response = await deleteProjectApi(project);
      if (!response) {
        dispatch(showErrorToast("Please try again in some time"));
      } else if (response.status !== 200) {
        dispatch(showErrorToast(response.data.message));
      } else {
        dispatch(deleteProjectLocal(project));
      }
    }
  }
);

export const rearrangeTaskInProjectAsync = createAsyncThunk(
  "tasks/project/rearrange",
  async (obj, { dispatch }) => {
    if (AuthService.isLoggedIn()) {
      let response = await rearrangeTaskApi(obj);
    }
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
    let response = await getAllProjectsFromIDB();
    dispatch(setAllProjects(response));
  }
);

export const deleteSectionAsync = createAsyncThunk(
  "delete/project",
  async ({ projectId, sectionId }, { dispatch, getState }) => {
    let response = await deleteSectionApi(projectId, sectionId);
    if (response.status === 200) {
      dispatch(showSuccessToast("Section deleted Successfully"));

      //update local state
      let projectCopy = JSON.parse(
        JSON.stringify(getState()["projects"].projects[projectId])
      );
      if (projectCopy && projectCopy.so) {
        let index = findIndex(projectCopy.so, sectionId);
        if (index !== -1) {
          projectCopy.so.splice(index, 1);
        }
        delete projectCopy.sections[sectionId];
        dispatch(updateLocalProjectAsync(projectCopy));
      }
    } else {
      dispatch(showErrorToast(response.data.message));
    }
  }
);
