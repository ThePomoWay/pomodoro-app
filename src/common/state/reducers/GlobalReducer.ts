export const initialGlobalState = {
    focusMode: false,
    showAddTaskModal: false
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
    }
}