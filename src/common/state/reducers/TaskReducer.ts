export const initialTaskState = {
    tasks: [],
    status: 'idle'
}

export let taskReducer = {
    pushTask: (state, action) => {
        let i;
        for(i=0;i < state.tasks.length; i++) {
            if(action.payload.id === state.tasks[i].id) {
                state.tasks[i] = action.payload;
                break;
            }
        }
        
        if(i === state.tasks.length) {
            state.tasks.push(action.payload);
        }
        
    },
    deleteTask: (state, action) => {
        console.log(state.tasks);
        state.tasks = state.tasks.filter(item => item.id !== action.payload.id);
        console.log(state.tasks);
    },
    markTaskAsComplete: (state, action) => {
        let task = getTaskFromArr(action.payload, state.tasks)
        task.completed = true;
        task.completedOn = new Date();
    },

    taskSelected: (state, action) => {
        if(action.payload && action.payload.id) {
            for(let task of state.tasks) {
                if(action.payload.id === task.id) {
                    task.isCurrentTask = true;
                }
                else {
                    task.isCurrentTask = false;
                }
            }
        }
    }
};

function getTaskFromArr(task, tasks) {
    return (tasks && tasks.filter(item => item.id === task.id)[0]) || null;
}