import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createIDBTask, updateIDBTask, deleteIDBTask } from "../../API/indexed-db-ops/crud";
import AuthService from "../../API/network/AuthService";
import { createTaskAPI, deleteTaskAPI, updateTaskAPI } from "../../API/network/TaskApis";
import { getAllTasks } from "../async";
import { initialTaskState, taskReducer } from "../reducers/TaskReducer";
import { tick } from "./TimerSlice";

export const createTask = createAsyncThunk(
    'tasks/create',
    async (task, { dispatch } ) => {
        dispatch(pushTask(task));
        let response = await createIDBTask(task);
        if(AuthService.isLoggedIn) {
            createTaskAPI(task);
        }
        return response;
    }
)

export const updateTask = createAsyncThunk(
    'tasks/update',
    async (task, {dispatch}) => {
        dispatch(pushTask(task));

        let response = await updateIDBTask(task);
        if(AuthService.isLoggedIn) {
            updateTaskAPI(task);
        }
        return response;
    }
);

export const markTaskAsCurrent = createAsyncThunk(
    'tasks/markAsCurrent',
    async (task: any, {getState, dispatch}) => {
        let tasks = getState()['tasks'].tasks;
        let currentTask = tasks.filter(item => item.isCurrentTask)[0];
        if(currentTask.fid === task.fid) {
            return;
        }

        //@ts-ignore
        dispatch(updateTask({...currentTask, isCurrentTask: false}));

        //@ts-ignore
        dispatch(updateTask({...task, isCurrentTask: true}));
        
    }
);

export const deleteTaskThunk = createAsyncThunk(
    'tasks/delete',
    async (task, { dispatch }) => {
        dispatch(deleteTask(task));
        let response = await deleteIDBTask(task);
        if(AuthService.isLoggedIn()) {
            deleteTaskAPI(task);
        }
        return response;
    }
)

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState: initialTaskState,
    reducers: taskReducer,
    extraReducers: (builder) => {
        builder.addCase(getAllTasks.fulfilled, (state, action) => {
            for(let task of action.payload as Array<any>) {
                state.tasks[task.fid] = task;
            }
            state.todaysTasks = state.allTasks = action.payload.map(i => i.fid);
            state.currentTaskRef = action.payload.filter(item => item.isCurrentTask)[0];
        })
        .addCase(createTask.pending, (state) => {
            state.status = 'creating';
        })
        .addCase(createTask.fulfilled, (state, action: any) => {
            if(action.payload.success) {
                state.status = 'created';
            }
        })
        .addCase(tick, (state) => {
            if(state.currentTaskRef) {
                state.currentTaskRef.csec += 1;
            }
        })
    }
})



export const {  pushTask, markTaskAsComplete, taskSelected, 
                deleteTask, rearrangeTodaysTask, rearrangeAllTasks
                , removeFromAllTasks, removeFromTodaysTasks,
                 addToAllTasks, addToTodaysTasks} = tasksSlice.actions;