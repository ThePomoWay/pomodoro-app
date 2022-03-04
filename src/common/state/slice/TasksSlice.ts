import { createSlice } from "@reduxjs/toolkit";
import { initialTaskState, taskReducer } from "../reducers/TaskReducer";

export const tasksSlice = createSlice({
  name: "tasks",
  initialState: initialTaskState,
  reducers: taskReducer,
});

export const {
  createTask,
  updateTask,
  markTaskAsComplete,
  taskSelected,
  deleteTask,
  updateTodaysTasks,
  rearrangeAllTasks,
  addToAllTasks,
  setEditTask,
  removeFromAllTasks,
  addToCompletedTasks,
  removeFromCompletedTasks,
  setCurrentTaskRef,
  setAllTasks,
  setTodaysTasks,
  incrementCurTaskSec,
} = tasksSlice.actions;
