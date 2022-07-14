import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTasks } from "../../API/APIService";
import {
  createIDBTask,
  updateIDBTask,
  deleteIDBTask,
} from "../../API/indexed-db-ops/crud";
import {
  getTodaysTasksFromIdb,
  updateTodaysTasksInIdb,
} from "../../API/indexed-db-ops/todaysTasks";
import AuthService from "../../API/network/AuthService";
import {
  addToTodaysTaskAPI,
  createTaskAPI,
  deleteTaskAPI,
  getAllTasksApi,
  markTaskAsCompleteApi,
  markTaskAsInCompleteApi,
  updateTaskAPI,
} from "../../API/network/TaskApis";
import {
  removeFromTodaysTasksApi,
  updateTodaysTaskAPI,
} from "../../API/network/TodaysTaskApis";
import { findIndex } from "../../utils/array-utils";
import { getObjFromArr, roundToOneDecimal } from "../../utils/common";
import { getFormattedDate, getReadableDate } from "../../utils/date-utils";
import { playCompleteTaskSound } from "../../utils/sound-utils";
import {
  saveTaskInOfflineStore,
  task_complete,
  task_create,
  task_delete,
  task_incomplete,
  task_update,
} from "../../offlineSync/offlineSync";

import { initialTaskState, taskReducer } from "../reducers/TaskReducer";
import {
  addToCompletedTasks,
  createTask,
  deleteTask,
  removeFromCompletedTasks,
  setAllTasks,
  setCurrentTaskRef,
  setTodaysTasks,
  updateCompletedTasks,
  updateTask,
  updateTodaysTasks,
} from "../slice/TasksSlice";
import {
  openOnboardingModal,
  setToast,
  showErrorToast,
  showSuccessToast,
} from "../slice/GlobalSlice";
import {
  addTaskToProjectLocal,
  removeTaskFromProject,
  updateLocalProjectAsync,
} from "./ProjectThunk";
import { projectChangeApi } from "../../API/network/ProjectApis";
import {
  DEFAULT_WORK_TIME,
  POMO_IDLE_STATE,
  POMO_PAUSED_STATE,
  POMO_RUNNING_STATE,
} from "../../utils/constants";
import { updateTimerState } from "./TimerThunk";
import { setPomoSummary } from "../slice/TimerSlice";
import { getAllProjectsFromIDB } from "../../API/indexed-db-ops/projectCrud";

export const getAllTasks = createAsyncThunk(
  "tasks/get",
  async (_, { dispatch }) => {
    let response = await getTasks();
    dispatch(setAllTasks(response));
  }
);

export const createLocalTaskThunk = createAsyncThunk(
  "tasks/local/create",
  async (payload: any, { dispatch }) => {
    dispatch(createTask(payload));
    let response = await createIDBTask(payload.task);
  }
);

export const createTaskThunk = createAsyncThunk(
  "tasks/create",
  async (payload: any, { dispatch }) => {
    dispatch(createLocalTaskThunk(payload));

    if (payload.isTodaysTask) {
      dispatch(
        addToTodaysTaskLocal({
          fid: payload.task.fid,
        })
      );
    }
    if (AuthService.isLoggedIn()) {
      createTaskAPI(payload.task)
        .then((response) => {
          if (response && response.status === 200) {
            dispatch(
              updateLocalTaskThunk({
                ...payload.task,
                _id: response.data.tid,
              })
            );

            if (payload.isTodaysTask) {
              addToTodaysTaskAPI(response.data.tid);
            }
          }
          if (!response) {
            saveTaskInOfflineStore(payload.task, task_create);
          }
        })
        .catch(function () {});
    }
  }
);

export const updateLocalTaskThunk = createAsyncThunk(
  "task/update/local",
  async (task: any, { dispatch }) => {
    dispatch(updateTask(task));

    let response = await updateIDBTask(task);
    return task;
  }
);

export const updateTaskThunk = createAsyncThunk(
  "tasks/update",
  async (task: any, { dispatch, getState }) => {
    let tasks = getState()["tasks"].tasks;
    let oldTask = tasks[task.fid];

    if (oldTask.project.projectID !== task.project.projectID) {
      if (AuthService.isLoggedIn() && task._id) {
        let response = await projectChangeApi(
          oldTask.project.projectID,
          task.project.projectID,
          task._id
        );
        if (response.status !== 200) {
          dispatch(showErrorToast({ msg: response.data.message }));
          return;
        }
      }
      dispatch(
        removeTaskFromProject({
          projectId: oldTask.project.projectID,
          sectionId: oldTask.project.secID,
          taskId: task.fid,
        })
      );
      dispatch(
        addTaskToProjectLocal({
          projectId: task.project.projectID,
          taskId: task.fid,
        })
      );
    }
    dispatch(updateLocalTaskThunk(task));

    if (AuthService.isLoggedIn()) {
      if (task._id) {
        updateTaskAPI(task).then((res) => {
          if (!res) {
            saveTaskInOfflineStore(task, task_update);
          }
        });
      } else {
        saveTaskInOfflineStore(task, task_update);
      }
    }
    return task;
  }
);

export const markTaskAsCurrent = createAsyncThunk(
  "tasks/markAsCurrent",
  async (task: any, { getState, dispatch }) => {
    let taskState = getState()["tasks"];
    let tasks = taskState.tasks;
    let timerState = getState()["timer"];
    let summary = window.structuredClone(timerState.pomoSummary);

    let fid = (task && task.fid) || taskState.currentTaskRef;

    if (fid) {
      if (
        timerState.pomoState === POMO_RUNNING_STATE ||
        timerState.pomoState === POMO_IDLE_STATE
      ) {
        if (
          summary[taskState.currentTaskRef] &&
          !summary[taskState.currentTaskRef].endTime
        ) {
          summary[taskState.currentTaskRef].csec += Math.round(
            (Date.now() - summary[taskState.currentTaskRef].startTime) / 1000
          );

          summary[taskState.currentTaskRef].endTime = Date.now();
        }
        if (summary[fid]) {
          summary[fid].startTime = Date.now();
          summary[fid].endTime = "";
        } else {
          summary[fid] = {
            csec: 0,
            startTime: Date.now(),
          };
        }
      } else if (timerState.pomoState === POMO_PAUSED_STATE) {
        if (summary[fid]) {
          summary[fid].startTime = Date.now();
          summary[fid].endTime = "";
        } else {
          summary[fid] = {
            csec: 0,
            startTime: Date.now(),
          };
        }
      }

      dispatch(setPomoSummary(summary));
      let currentTask = Object.keys(tasks)
        .map((i) => tasks[i])
        .filter((item) => item.isCurrentTask)[0];
      if (!currentTask) {
        //@ts-ignore
        dispatch(updateLocalTaskThunk({ ...task, isCurrentTask: true }));
        return;
      }
      if (currentTask.fid === fid) {
        return;
      }

      //@ts-ignore
      dispatch(updateLocalTaskThunk({ ...currentTask, isCurrentTask: false }));

      //@ts-ignore
      dispatch(updateLocalTaskThunk({ ...task, isCurrentTask: true }));
    }
  }
);

export const unMarkTaskAsCurrent = createAsyncThunk(
  "tasks/unMarkAsCurrent",
  async (task: any, { dispatch }) => {
    dispatch(updateLocalTaskThunk({ ...task, isCurrentTask: false }));
  }
);

export const deleteTaskThunk = createAsyncThunk(
  "tasks/delete",
  async (task: any, { dispatch, getState }) => {
    let todaysTasks = getState()["tasks"].todaysTasks;
    let isTaskInTodays = false;
    for (let fid of todaysTasks) {
      if (fid === task.fid) {
        isTaskInTodays = true;
        break;
      }
    }
    dispatch(
      removeTaskFromProject({
        projectId: task.project.projectID,
        sectionId: task.project.secID,
        taskId: task.fid,
      })
    );
    dispatch(
      removeFromTodaysTaskLocal({
        fid: task.fid,
      })
    );
    dispatch(deleteTask(task));
    let response = await deleteIDBTask(task);

    if (AuthService.isLoggedIn()) {
      if (!!task._id) {
        deleteTaskAPI(task, isTaskInTodays).then((res) => {
          if (!res) {
            saveTaskInOfflineStore(task, task_delete);
          }
        });
      } else {
        saveTaskInOfflineStore(task, task_delete);
      }
    }

    dispatch(
      setToast({
        msg: "Task was deleted successfully",
        open: true,
      })
    );
    return response;
  }
);

export const markTaskAsCompleteLocal = createAsyncThunk(
  "task/complete/local",
  async (obj, { dispatch, getState }) => {
    let completedOn = new Date().toISOString();

    if (obj.task && obj.task.isCurrentTask) {
      dispatch(setCurrentTaskRef(""));
    }
    dispatch(
      updateLocalTaskThunk({
        ...obj.task,
        isComplete: true,
        isCurrentTask: false,
        completedOn,
      })
    );

    dispatch(showSuccessToast("Kudos! 1 task completed!"));
    playCompleteTaskSound();

    dispatch(removeFromTodaysTaskLocal({ fid: obj.task.fid }));
    dispatch(addToCompletedTasks({ fid: obj.task.fid }));

    let project = getState()["projects"].projects[obj.task.project.projectID];

    let taskOrderCopy = [...project.to];
    if (obj.task.project.secID) {
      taskOrderCopy = [...project.sections[obj.task.project.secID].to];

      taskOrderCopy.splice(<number>findIndex(taskOrderCopy, obj.task.fid), 1);
      //let completedTaskOrder = [...project.sections[obj.sectionId].completedTaskOrder, obj.task.fid]
      //@ts-ignore
      dispatch(
        updateLocalProjectAsync({
          ...project,
          sections: {
            ...project.sections,
            [obj.task.project.secID]: {
              ...project.sections[obj.task.project.secID],
              to: taskOrderCopy,
            },
          },
        })
      );
    } else {
      let index = <number>findIndex(taskOrderCopy, obj.task.fid);
      if (index !== -1) {
        taskOrderCopy.splice(index, 1);
        //let completedTaskOrder = [...project.completedTaskOrder, obj.task.fid]

        dispatch(
          updateLocalProjectAsync({
            ...project,
            to: taskOrderCopy,
          })
        );
      }
    }
  }
);

export const markTaskAsCompleteThunk = createAsyncThunk(
  "task/markAsComplete",
  async (obj: any, { dispatch, getState }) => {
    if (!AuthService.isLoggedIn()) {
      dispatch(openOnboardingModal());
    } else {
      let completedOn = new Date().toISOString();

      dispatch(markTaskAsCompleteLocal(obj));

      let taskState = getState()["tasks"];
      let timerState = getState()["timer"];
      let summary = window.structuredClone(timerState.pomoSummary);

      let todaysTasksObj = getObjFromArr(taskState.todaysTasks);

      if (obj.task._id) {
        if (
          timerState.pomoState === POMO_RUNNING_STATE &&
          taskState.currentTaskRef === obj.task.fid &&
          summary[taskState.currentTaskRef]
        ) {
          summary[taskState.currentTaskRef].csec += Math.round(
            (Date.now() - summary[taskState.currentTaskRef].startTime) / 1000
          );

          summary[taskState.currentTaskRef].endTime = Date.now();

          dispatch(setPomoSummary(summary));

          dispatch(incrementTaskCpomos(summary));
        }

        let completedTaskResponse = await markTaskAsCompleteApi(
          {
            project: obj.task.project,
            _id: obj.task._id,
            uid: AuthService.getUserId(),
          },
          obj.task.fid in todaysTasksObj,
          completedOn,
          obj.task._id
        );
        if (!completedTaskResponse) {
          //user is offline or backend is down.
          saveTaskInOfflineStore(
            { ...obj.task, completedOn: completedOn },
            task_complete
          );
          dispatch(
            setToast({
              open: true,
              msg: "We're facing some issues, please try again in some time.",
              duration: 3000,
              type: "failure",
            })
          );
        } else if (completedTaskResponse.status !== 200) {
          dispatch(
            setToast({
              open: true,
              msg: completedTaskResponse.data.msg,
              duration: 3000,
              type: "failure",
            })
          );
        }
      }
    }
  }
);

export const markTaskAsInCompleteThunk = createAsyncThunk(
  "task/markAsInComplete",
  async (obj: any, { dispatch, getState }) => {
    dispatch(
      updateLocalTaskThunk({
        ...obj.task,
        isComplete: false,
        isCurrentTask: false,
      })
    );

    dispatch(removeFromCompletedTasks({ fid: obj.task.fid }));
    if (obj.container === "todays") {
      dispatch(addToTodaysTaskLocal({ fid: obj.task.fid }));
    }

    let project = getState()["projects"].projects[obj.task.project.projectID];
    let taskOrderCopy = [...project.to, obj.task.fid];

    if (AuthService.isLoggedIn()) {
      if (obj.task._id) {
        let response = await markTaskAsInCompleteApi(
          JSON.parse(JSON.stringify(obj.task)),
          obj.container === "todays",
          obj.task._id
        );
        if (!response) {
          saveTaskInOfflineStore(obj.task, task_incomplete);
          dispatch(
            setToast({
              open: true,
              msg: response.data.msg,
              duration: 5000,
              type: "failure",
            })
          );
        }
      } else {
        saveTaskInOfflineStore(obj.task, task_incomplete);
      }
    }

    if (obj.task.project.secID) {
      taskOrderCopy = [
        ...project.sections[obj.task.project.secID].to,
        obj.task.fid,
      ];

      // let completedTaskOrderCopy = [...project.sections[obj.sectionId].completedTaskOrder];
      // completedTaskOrderCopy.splice(findIndex(completedTaskOrderCopy, obj.task.fid), 1);

      //@ts-ignore
      dispatch(
        updateLocalProjectAsync({
          ...project,
          sections: {
            ...project.sections,
            [obj.task.project.secID]: {
              ...project.sections[obj.task.project.secID],
              to: taskOrderCopy,
            },
          },
        })
      );
    } else {
      dispatch(
        updateLocalProjectAsync({
          ...project,
          to: taskOrderCopy,
        })
      );
    }
  }
);

export const getAllCompletedTasks = createAsyncThunk(
  "tasks/get",
  async (payload: any, { dispatch, getState }) => {
    let today = new Date();
    let defaultStartDate =
      (payload && new Date(payload.startDate)) ||
      new Date(new Date().setDate(today.getDate() - 7));
    let defaultEndDate =
      (payload && new Date(payload.endDate)) ||
      new Date(new Date().setDate(today.getDate()));

    let completedTasksResponse = await getAllTasksApi({
      from: new Date(defaultStartDate).toISOString(),
      till: new Date(defaultEndDate).toISOString(),
      completed: true,
    });

    let completedTasks = [];

    let projects = getObjFromArr(await getAllProjectsFromIDB(), "_id", true);
    let userPref = getState()["global"].userPreferences;
    let defaultWorkTime = userPref.defaultWorkTime || DEFAULT_WORK_TIME;
    if (completedTasksResponse.status === 200) {
      completedTasks = completedTasksResponse.data.tasks.map((item) => ({
        ...item,
        readCreatedOn: getReadableDate(new Date(item.createdOn)),
        readCompletedOn: getReadableDate(new Date(item.completedOn)),
        readProject:
          item.project &&
          item.project.projectID &&
          projects[item.project.projectID].title,
        totalDays:
          Math.floor(
            (new Date(item.completedOn).getTime() -
              new Date(item.createdOn).getTime()) /
              (1000 * 3600 * 24)
          ) + 1,
        cpomo: roundToOneDecimal(item.csec / defaultWorkTime),
      }));
      dispatch(
        updateCompletedTasks({
          to: defaultEndDate.toISOString(),
          from: defaultStartDate.toISOString(),
          tasks: completedTasks,
        })
      );
    }
  }
);

export const incrementCurTaskCpomo = createAsyncThunk(
  "tasks/updatePomo",
  async (_, { dispatch, getState }) => {
    let state = getState()["tasks"];
    if (state.currentTaskRef) {
      let updatedTask = state.tasks[state.currentTaskRef];

      //@ts-ignore
      dispatch(
        updateLocalTaskThunk({
          ...updatedTask,
          cpomo: updatedTask.cpomo + 1,
          csec: updatedTask.csec,
        })
      );
    }
  }
);

export const incrementTaskCpomos = createAsyncThunk(
  "tasks/updateCpomos",
  async (summaryArr: any, { getState, dispatch }) => {
    let state = getState()["tasks"];
    let userPref = getState()["global"].userPreferences;
    let defaultWorkTime = userPref.defaultWorkTime || DEFAULT_WORK_TIME;
    if (summaryArr.length > 0) {
      for (let entry of summaryArr) {
        dispatch(
          updateLocalTaskThunk({
            ...state.tasks[entry.fid],
            cpomo:
              state.tasks[entry.fid].cpomo +
              roundToOneDecimal(entry.csec / defaultWorkTime),
          })
        );
      }
    }
  }
);

export const incrementCurTaskCsec = createAsyncThunk(
  "tasks/updatecsec",
  async (_, { dispatch, getState }) => {
    let state = getState()["tasks"];
    if (state.currentTaskRef) {
      let updatedTask = state.tasks[state.currentTaskRef];

      //@ts-ignore
      dispatch(
        updateLocalTaskThunk({
          ...updatedTask,
          cpomo: updatedTask.cpomo,
          csec: updatedTask.csec + 1,
        })
      );
    }
  }
);

//Todays task actions

export const getTodaysTasks = createAsyncThunk(
  "tasks/getTodaysTasks",
  async (_, { dispatch, getState }) => {
    let todaysTasks = await getTodaysTasksFromIdb();

    let tasks = getState()["tasks"].tasks;

    dispatch(setTodaysTasks(todaysTasks));
  }
);

export const rearrangeTodaysTask = createAsyncThunk(
  "tasks/todays/rearrange",
  async (obj: any, { getState, dispatch }) => {
    let todaysTasks = JSON.parse(
      JSON.stringify(getState()["tasks"].todaysTasks)
    );

    let fid = todaysTasks.splice(obj.source, 1);
    todaysTasks.splice(obj.destination, 0, fid[0]);

    updateTodaysTasksInIdb(todaysTasks);
    dispatch(updateTodaysTasks(todaysTasks));

    if (AuthService.isLoggedIn()) {
      let tasks = getState()["tasks"].tasks;

      let response = await updateTodaysTaskAPI(
        todaysTasks
          .map((item) => tasks[item] && tasks[item]._id)
          .filter((i) => i)
      );
      if (!response) {
        saveTaskInOfflineStore();
      }
    }
  }
);

export const addToTodaysTaskLocal = createAsyncThunk(
  "tasks/today/update/local",
  async (obj: any, { getState, dispatch }) => {
    let todaysTasks = JSON.parse(
      JSON.stringify(getState()["tasks"].todaysTasks)
    );
    if (obj.index !== undefined) {
      todaysTasks.splice(obj.index, 0, obj.fid);
    } else {
      todaysTasks.push(obj.fid);
    }

    updateTodaysTasksInIdb(todaysTasks);
    dispatch(updateTodaysTasks(todaysTasks));
  }
);

export const setTodaysTaskLocal = createAsyncThunk(
  "tasks/today/set",
  async (taskIdArr: any, { dispatch }) => {
    updateTodaysTasksInIdb(taskIdArr);
    dispatch(updateTodaysTasks(taskIdArr));
  }
);

export const addToTodaysTasks = createAsyncThunk(
  "tasks/todays/rearrange",
  async (obj: any, { getState, dispatch }) => {
    dispatch(addToTodaysTaskLocal(obj));

    if (AuthService.isLoggedIn()) {
      await addToTodaysTaskAPI(obj._id);
    }
  }
);

export const removeFromTodaysTaskLocal = createAsyncThunk(
  "tasks/todays/local",
  async (payload: any, { dispatch, getState }) => {
    let todaysTasks = JSON.parse(
      JSON.stringify(getState()["tasks"].todaysTasks)
    );

    if (payload.index !== undefined) {
      todaysTasks.splice(payload.index, 1);
    } else if (payload.fid) {
      let index = findIndex(todaysTasks, payload.fid);
      if (index !== -1) {
        todaysTasks.splice(index, 1);
      }
    }

    updateTodaysTasksInIdb(todaysTasks);
    dispatch(updateTodaysTasks(todaysTasks));
  }
);

export const removeFromTodaysTasks = createAsyncThunk(
  "tasks/todays/delete",
  async (payload: any, { getState, dispatch }) => {
    dispatch(removeFromTodaysTaskLocal(payload));

    if (AuthService.isLoggedIn()) {
      if (payload._id) {
        var resp = await removeFromTodaysTasksApi(payload._id);
        if (!resp) {
          saveTaskInOfflineStore();
        }
      } else {
        saveTaskInOfflineStore();
      }
    }
  }
);

export const clearTodaysTasksThunk = createAsyncThunk(
  "tasks/todays/remove",
  (_, { dispatch }) => {
    updateTodaysTasksInIdb([]);
    dispatch(updateTodaysTasks([]));
  }
);
