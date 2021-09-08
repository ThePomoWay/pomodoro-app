import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createIDBTask, updateIDBTask, deleteIDBTask } from "../../API/indexed-db-ops/crud";
import { getAllTasks } from "../async";
import { initialTaskState, taskReducer } from "../reducers/TaskReducer";

export const createTask = createAsyncThunk(
    'tasks/create',
    async (task, { dispatch } ) => {
        dispatch(pushTask(task));
        let response = await createIDBTask(task);
        return response;
    }
)

export const updateTask = createAsyncThunk(
    'tasks/update',
    async (task, {dispatch}) => {
        dispatch(pushTask(task));

        let response = await updateIDBTask(task);
        return response;
    }
);

export const markTaskAsCurrent = createAsyncThunk(
    'tasks/markAsCurrent',
    async (task: any, {getState, dispatch}) => {
        let tasks = getState()['tasks'].tasks;
        console.log(tasks);
        let currentTask = tasks.filter(item => item.isCurrentTask)[0];
        if(currentTask.id === task.id) {
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
        return response;
    }
)

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState: initialTaskState,
    reducers: taskReducer,
    extraReducers: (builder) => {
        builder.addCase(getAllTasks.fulfilled, (state, action) => {
            state.tasks = action.payload as any;
        })
        .addCase(createTask.pending, (state) => {
            state.status = 'creating';
        })
        .addCase(createTask.fulfilled, (state, action: any) => {
            if(action.payload.success) {
                state.status = 'created';
            }
        })
    }
})



export const { pushTask, markTaskAsComplete, taskSelected, deleteTask} = tasksSlice.actions;