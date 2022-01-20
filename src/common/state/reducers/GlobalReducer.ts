export const initialGlobalState = {
    focusMode: false,
    showAddTaskBtn: false,
    taskToBeEdited: {},
    extensionPresent: false,
    onboardingModalOpen: false
};

export let globalReducer = {
    showAddTaskBtn: (state) => {
        state.showAddTaskBtn = true;
    },
    hideAddTaskBtn: (state) => {
        state.showAddTaskBtn = false;
    },
    setFocusMode: (state, action) => {
        state.focusMode = action.payload;
    },

    editTask: (state, action) => {
        state.taskToBeEdited = action.payload;
    },

    clearTaskToBeEdited: (state, action) => {
        state.taskToBeEdited = {};
    },
    setExtensionPresent: (state, action) => {
        state.extensionPresent = action.payload;
    },
    openOnboardingModal: (state) => {
        state.onboardingModalOpen = true;
    },
    closeOnboardingModal: (state) => {
        state.onboardingModalOpen = false;
    }
}