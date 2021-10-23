export const initialTaskState = {
    tasks: {},
    todaysTasks: [],
    allTasks: [],
    currentTaskRef: {}
}

export let taskReducer = {
    pushTask: (state, action) => {
        state.tasks[action.payload.fid] = action.payload;

        if(action.payload.isCurrentTask) {
            state.currentTaskRef = action.payload;
        }
        
    },
    deleteTask: (state, action) => {
        delete state.tasks[action.payload.fid];
        state.todaysTasks = state.todaysTasks.filter(item => item.fid !== action.payload.fid);
        state.allTasks = state.allTasks.filter(item => item.fid !== action.payload.fid);

        if(state.currentTaskRef.fid === action.payload.fid) {
            state.currentTaskRef = {};
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
                    state.currentTaskRef = action.payload;
                }
                else {
                    state.tasks[fid].isCurrentTask = false;
                }
            }
        }
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
        state.todaysTasks.splice(action.payload.index, 1);
    },
    removeFromAllTasks: (state, action) => {
        state.allTasks.splice(action.payload.index, 1);
    },
    addToTodaysTasks: (state, action) => {
        if(action.payload.index !== null) {
            state.todaysTasks.splice(action.payload.index, 0, action.payload.item);
        }
        else {
            state.todaysTasks.push(action.payload.item);
        }
    },
    addToAllTasks: (state, action) => {
        if(action.payload.index !== null) {
            state.allTasks.splice(action.payload.index, 0, action.payload.item);
        }
        else {
            state.allTasks.push(action.payload.item);
        }
    }
};

function getTaskFromArr(task, tasks) {
    return (tasks && tasks.filter(item => item.fid === task.fid)[0]) || null;
}