import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createIDBTask, updateIDBTask, deleteIDBTask } from "../../API/indexed-db-ops/crud";
import { getTodaysTasksFromIdb, updateTodaysTasksInIdb } from "../../API/indexed-db-ops/todaysTasks";
import AuthService from "../../API/network/AuthService";
import { createTaskAPI, deleteTaskAPI, updateTaskAPI } from "../../API/network/TaskApis";
import { findIndex } from "../../utils/array-utils";
import { getAllTasks } from "../async";
import { initialTaskState, taskReducer } from "../reducers/TaskReducer";
import { tick } from "./TimerSlice";

export const createTaskThunk = createAsyncThunk(
    'tasks/create',
    async (payload: any, { dispatch } ) => {
        dispatch(createTask(payload));
        let response = await createIDBTask(payload.task);

        if(payload.isTodaysTask) {
            dispatch(addToTodaysTasks({
                fid: payload.task.fid
            }))    
        }
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
        dispatch(removeFromTodaysTasks({
            fid: task.fid
        }));
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

//Todays task actions

export const getTodaysTasks = createAsyncThunk(
    'tasks/getTodaysTasks',
    async (_, {dispatch}) => {
        let todaysTasks = await getTodaysTasksFromIdb();

        return todaysTasks;
    }
)

export const rearrangeTodaysTask = createAsyncThunk(
    'tasks/todays/rearrange',
    async (obj: any, {getState, dispatch}) => {
        let todaysTasks = JSON.parse(JSON.stringify(getState()['tasks'].todaysTasks))

        let fid = todaysTasks.splice(obj.source, 1);
        todaysTasks.splice(obj.destination, 0, fid[0]);

        updateTodaysTasksInIdb(todaysTasks);
        dispatch(updateTodaysTasks(todaysTasks));
    }
)

export const addToTodaysTasks = createAsyncThunk(
    'tasks/todays/rearrange',
    async (obj: any, {getState, dispatch}) => {
        let todaysTasks = JSON.parse(JSON.stringify(getState()['tasks'].todaysTasks))
        if(obj.index !== undefined) {
            todaysTasks.splice(obj.index, 0, obj.fid);
        }
        else {
            todaysTasks.push(obj.fid);
        }

        updateTodaysTasksInIdb(todaysTasks);
        dispatch(updateTodaysTasks(todaysTasks));
    }
)

export const removeFromTodaysTasks = createAsyncThunk(
    'tasks/todays/rearrange',
    async (payload: any, {getState, dispatch}) => {
        let todaysTasks = JSON.parse(JSON.stringify(getState()['tasks'].todaysTasks))
        
        if(payload.index !== undefined){
            todaysTasks.splice(payload.index, 1);
        }
        else if(payload.fid) {
            let index = findIndex(todaysTasks, payload.fid);
            if(index !== -1) {
                todaysTasks.splice(index, 1);
            }
        }

        updateTodaysTasksInIdb(todaysTasks);
        dispatch(updateTodaysTasks(todaysTasks));
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

            state.allTasks = Object.keys(state.tasks);

            let currentTask = action.payload.filter(item => item.isCurrentTask)[0];
            state.currentTaskRef = currentTask && currentTask.fid;
        })
        .addCase(getTodaysTasks.fulfilled, (state, action) => {
            state.todaysTasks = <any> action.payload;
        })
        .addCase(tick, (state) => {
            if(state.currentTaskRef) {
                state.tasks[state.currentTaskRef].summary.csec += 1;
            }
        })
    }
})



export const { createTask, updateTask, markTaskAsComplete, taskSelected, 
                deleteTask, updateTodaysTasks, rearrangeAllTasks,
                 addToAllTasks, setEditTask, removeFromAllTasks } = tasksSlice.actions;