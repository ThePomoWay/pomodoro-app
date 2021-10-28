import { findIndex } from "../../utils/array-utils";

export const initialTaskState = {
    tasks: {},
    todaysTasks: [],
    allTasks: [],
    currentTaskRef: '',
    editTaskRef: ''
}

export let taskReducer = {
    createTask: (state, action) => {
        state.tasks[action.payload.task.fid] = action.payload.task;

        state.allTasks.push(action.payload.task.fid);

        if(action.payload.isCurrentTask) {
            state.currentTaskRef = action.payload.task.fid;
        }
        
    },
    updateTask: (state, action) => {
        state.tasks[action.payload.fid] = action.payload;

        if(action.payload.isCurrentTask) {
            state.currentTaskRef = action.payload.fid;
        }
    },
    deleteTask: (state, action) => {
        delete state.tasks[action.payload.fid];
        
        let ind = findIndex(state.allTasks, action.payload.fid);
        if(ind !== -1) {
            state.allTasks.splice(ind, 1);
        }

        if(state.currentTaskRef === action.payload.fid) {
            state.currentTaskRef = '';
        }
    },
    markTaskAsComplete: (state, action) => {
        let task = state.tasks[action.payload.fid];
        task.completed = true;
        task.completedOn = new Date();
    },

    taskSelected: (state, action) => {
        if(action.payload && action.payload.fid) {
            for(let fid in state.tasks) {
                if(action.payload.fid === fid) {
                    state.tasks[fid].isCurrentTask = true;
                    state.currentTaskRef = action.payload.fid;
                }
                else {
                    state.tasks[fid].isCurrentTask = false;
                }
            }
        }
    },
    updateTodaysTasks: (state, action) => {
        state.todaysTasks = action.payload;
    },
    rearrangeTodaysTask: (state, action) => {
        if(action.payload.source !== action.payload.destination) {
            let fid = state.todaysTasks.splice(action.payload.source, 1);
            state.todaysTasks.splice(action.payload.destination, 0, fid);
        }
    },
    rearrangeAllTasks: (state, action) => {
        if(action.payload.source !== action.payload.destination) {
            let fid = state.allTasks.splice(action.payload.source, 1);
            state.allTasks.splice(action.payload.destination, 0, fid);
        }
    },
    removeFromTodaysTasks: (state, action) => {
        if(action.payload.index !== undefined) {
            state.todaysTasks.splice(action.payload.index, 1);
        }
        else if(action.payload.fid) {
            let index = findIndex(state.todaysTasks, action.payload.fid);
            state.todaysTasks.splice(index, 1);
        }
    },
    removeFromAllTasks: (state, action) => {
        if(action.payload.index !== undefined){
            state.allTasks.splice(action.payload.index, 1);
        }
        else if(action.payload.fid) {
            let index = findIndex(state.allTasks, action.payload.fid);
            state.allTasks.splice(index, 1);
        }
    },
    addToTodaysTasks: (state, action) => {
        if(action.payload.index !== undefined) {
            state.todaysTasks.splice(action.payload.index, 0, action.payload.fid);
        }
        else {
            state.todaysTasks.push(action.payload.fid);
        }
    },
    addToAllTasks: (state, action) => {
        if(action.payload.index !== null) {
            state.allTasks.splice(action.payload.index, 0, action.payload.fid);
        }
        else {
            state.allTasks.push(action.payload.fid);
        }
    },
    setEditTask: (state, action) => {
        state.editTaskRef = action.payload;
    }
};

