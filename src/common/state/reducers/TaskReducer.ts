export const initialTaskState = {
    tasks: []
}

export let taskReducer = {
    createTask: (state, action) => {
        state.tasks.push(action.payload);
    },
    markTaskAsComplete: (state, action) => {
        for(let element of state.tasks) {
            if(element.id === action.payload) {
                element.completed = true;
                element.completedOn = new Date();
                return
            }
        };
    }
};