import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createIDBTask, updateIDBTask, deleteIDBTask } from "../../API/indexed-db-ops/crud";
import { getTodaysTasksFromIdb } from "../../API/indexed-db-ops/todaysTasks";
import AuthService from "../../API/network/AuthService";
import { createTaskAPI, deleteTaskAPI, updateTaskAPI } from "../../API/network/TaskApis";
import { getAllTasks } from "../async";
import { initialTaskState, taskReducer } from "../reducers/TaskReducer";
import { tick } from "./TimerSlice";

export const createTaskThunk = createAsyncThunk(
    'tasks/create',
    async (payload, { dispatch } ) => {
        dispatch(createTask(payload));
        let response = await createIDBTask(payload.task);
        if(AuthService.isLoggedIn()) {
            createTaskAPI(payload.task);
        }
        return response;
    }
)

export const updateTaskThunk = createAsyncThunk(
    'tasks/update',
    async (task, {dispatch}) => {
        dispatch(updateTask(task));

        let response = await updateIDBTask(task);
        if(AuthService.isLoggedIn()) {
            updateTaskAPI(task);
        }
        return task;
    }
);

export const markTaskAsCurrent = createAsyncThunk(
    'tasks/markAsCurrent',
    async (task: any, {getState, dispatch}) => {
        let tasks = getState()['tasks'].tasks;
        let currentTask = Object.keys(tasks).map(i=>tasks[i]).filter(item => item.isCurrentTask)[0];
        if(!currentTask) {
            //@ts-ignore
            dispatch(updateTask({...task, isCurrentTask: true}));
            return;
        }
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

export const incrementCurTaskCpomo = createAsyncThunk(
    'tasks/updatePomo',
    async (_, {dispatch, getState}) => {
        let state = getState()['tasks'];
        if(state.currentTaskRef) {
            let updatedTask = state.tasks[state.currentTaskRef];

            //@ts-ignore
            dispatch(updateTaskThunk({
                ...updatedTask,
                summary: {
                    cpomo: updatedTask.summary.cpomo + 1,
                    csec: updatedTask.summary.csec
                }
            }))
        }
    }
)

export const getTodaysTasks = createAsyncThunk(
    'tasks/getTodaysTasks',
    async (_, {dispatch}) => {
        let todaysTasks = getTodaysTasksFromIdb();
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

            let currentTask = action.payload.filter(item => item.isCurrentTask)[0];
            state.currentTaskRef = currentTask && currentTask.fid;
        })
        .addCase(tick, (state) => {
            if(state.currentTaskRef) {
                state.tasks[state.currentTaskRef].summary.csec += 1;
            }
        })
    }
})



export const { createTask, updateTask, markTaskAsComplete, taskSelected, 
                deleteTask, rearrangeTodaysTask, rearrangeAllTasks
                , removeFromAllTasks, removeFromTodaysTasks,
                 addToAllTasks, addToTodaysTasks, setEditTask } = tasksSlice.actions;