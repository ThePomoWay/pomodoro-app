export const initialGlobalState = {
    focusMode: false,
    showAddTaskBtn: false,
    taskToBeEdited: {}
};

export let globalReducer = {
    showAddTaskBtn: (state) => {
        state.showAddTaskBtn = true;
    },
    hideAddTaskBtn: (state) => {
        state.showAddTaskBtn = false;
    },
    enableFocusMode: (state) => {
        state.focusMode = true;
    },
    disableFocusMode: (state) => {
        state.focusMode = false;
    },

    editTask: (state, action) => {
        state.taskToBeEdited = action.payload;
    },

    clearTaskToBeEdited: (state, action) => {
        state.taskToBeEdited = {};
    }
}