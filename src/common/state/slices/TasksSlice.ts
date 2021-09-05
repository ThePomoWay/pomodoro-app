import { createSlice } from "@reduxjs/toolkit";
import { initialTaskState, taskReducer } from "../reducers/TaskReducer";


export const tasksSlice = createSlice({
    name: 'tasks',
    initialState: initialTaskState,
    reducers: taskReducer
})

export const {createTask, markTaskAsComplete} = tasksSlice.actions