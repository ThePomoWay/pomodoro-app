export const initialGlobalState = {
    focusMode: false,
    showAddTaskModal: false,
    taskToBeEdited: {}
};

export let globalReducer = {
    showTaskModal: (state) => {
        state.showAddTaskModal = true;
    },
    hideTaskModal: (state) => {
        state.showAddTaskModal = false;
    },
    enableFocusMode: (state) => {
        state.focusMode = true;
    },
    disableFocusMode: (state) => {
        state.focusMode = false;
    },

    editTask: (state, action) => {
        state.taskToBeEdited = action.payload;
        state.showAddTaskModal = true;
    },

    clearTaskToBeEdited: (state, action) => {
        state.taskToBeEdited = {};
    }
}