import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createIDBTask, updateIDBTask, deleteIDBTask } from "../../API/indexed-db-ops/crud";
import { getTodaysTasksFromIdb, updateTodaysTasksInIdb } from "../../API/indexed-db-ops/todaysTasks";
import AuthService from "../../API/network/AuthService";
import { addToTodaysTaskAPI, createTaskAPI, deleteTaskAPI, updateTaskAPI } from "../../API/network/TaskApis";
import { findIndex } from "../../utils/array-utils";
import { getAllTasks } from "../async";
import { initialTaskState, taskReducer } from "../reducers/TaskReducer";
import { addTaskToProject, updateProjectAsync } from "./ProjectSlice";
import {  tickAsync } from "./TimerSlice";

export const createTaskThunk = createAsyncThunk(
    'tasks/create',
    async (payload: any, { dispatch } ) => {
        dispatch(createTask(payload));
        let response = await createIDBTask(payload.task);

        if(payload.isTodaysTask) {
            dispatch(addToTodaysTasks({
                fid: payload.task.fid
            }));

        }
        if(AuthService.isLoggedIn()) {
            createTaskAPI(payload.task).then((response) => {
                if(response.status === 200) {
                    dispatch(updateLocalTaskThunk({
                        ...payload.task,
                        _id: response.data.tid
                    }));

                    if(payload.isTodaysTask) {
                        addToTodaysTaskAPI(response.data.tid);
                    }
                }
            });

            

        }
        return response;
    }
)

export const updateLocalTaskThunk = createAsyncThunk(
    'task/update/local',
    async (task, {dispatch}) => {
        dispatch(updateTask(task));

        let response = await updateIDBTask(task);
        return task;
    }
)

export const updateTaskThunk = createAsyncThunk(
    'tasks/update',
    async (task, {dispatch}) => {
        dispatch(updateLocalTaskThunk(task));

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

export const markTaskAsCompleteThunk = createAsyncThunk(
    'task/markAsComplete',
    async (obj: any, {dispatch, getState}) => {

        dispatch(updateTaskThunk({
            ...obj.task,
            isComplete: true,
            completedOn: new Date().toISOString()
        }))

        if(obj.container === 'todays'){
            dispatch(addToCompletedTasks({fid: obj.task.fid}));
        }

        if(obj.container === 'projects') {
            let project = getState()['projects'].projects[obj.projectId]
            let taskOrderCopy = [...project.taskOrder];
            if(obj.sectionId) {
                taskOrderCopy = [...project.sections[obj.sectionId].taskOrder]

                taskOrderCopy.splice(<number>findIndex(taskOrderCopy, obj.task.fid), 1);
                //let completedTaskOrder = [...project.sections[obj.sectionId].completedTaskOrder, obj.task.fid]
                //@ts-ignore
                dispatch(updateProjectAsync({
                    ...project,
                    sections: {
                        ...project.sections,
                        [obj.sectionId]: {
                            ...project.sections[obj.sectionId],
                            to: taskOrderCopy
                        }
                    }
                }))
            }
            else{
                taskOrderCopy.splice(<number>findIndex(taskOrderCopy, obj.task.fid), 1);
                //let completedTaskOrder = [...project.completedTaskOrder, obj.task.fid]

                dispatch(updateProjectAsync({
                    ...project,
                    to: taskOrderCopy
                }))
            }
        }
    }
)

export const markTaskAsInCompleteThunk = createAsyncThunk(
    'task/markAsComplete',
    async (obj: any, {dispatch, getState}) => {

        dispatch(updateTaskThunk({
            ...obj.task,
            isComplete: false
        }))

        if(obj.container === 'todays'){
            dispatch(removeFromCompletedTasks({fid: obj.task.fid}));
        }

        if(obj.container === 'projects') {
            let project = getState()['projects'].projects[obj.projectId]    
            let taskOrderCopy = [...project.taskOrder, obj.task.fid];

            if(obj.sectionId) {
                taskOrderCopy = [...project.sections[obj.sectionId].taskOrder, obj.task.fid]

                // let completedTaskOrderCopy = [...project.sections[obj.sectionId].completedTaskOrder];
                // completedTaskOrderCopy.splice(findIndex(completedTaskOrderCopy, obj.task.fid), 1);

                //@ts-ignore
                dispatch(updateProjectAsync({
                    ...project,
                    sections: {
                        ...project.sections,
                        [obj.sectionId]: {
                            ...project.sections[obj.sectionId],
                            to: taskOrderCopy
                        }
                    }
                }))
            }
            else {
                dispatch(updateProjectAsync({
                    ...project,
                    to: taskOrderCopy
                }))
            }
        }
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

                if(task.isComplete) {
                    state.todaysCompletedTasks.push(task.fid);
                }
            }

            state.allTasks = Object.keys(state.tasks);

            let currentTask = action.payload.filter(item => item.isCurrentTask)[0];
            state.currentTaskRef = currentTask && currentTask.fid;
        })
        .addCase(getTodaysTasks.fulfilled, (state, action) => {
            state.todaysTasks = <any> action.payload;
        })
        .addCase(tickAsync, (state) => {
            if(state.currentTaskRef) {
                state.tasks[state.currentTaskRef].summary.csec += 1;
            }
        })
    }
})



export const { createTask, updateTask, markTaskAsComplete, taskSelected, 
                deleteTask, updateTodaysTasks, rearrangeAllTasks,
                 addToAllTasks, setEditTask, removeFromAllTasks,
                addToCompletedTasks, removeFromCompletedTasks } = tasksSlice.actions;