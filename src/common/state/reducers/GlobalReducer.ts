export const initialGlobalState = {
  focusMode: false,
  showAddTaskBtn: false,
  taskToBeEdited: {},
  extensionPresent: false,
  onboardingModalOpen: false,
  projectModalOpen: false,
  labelModalOpen: false,
  hideFirstUserScreen: false,
  toast: {
    open: false,
    msg: "Todays tasks have been deleted successfully",
    duration: 5000,
    type: "success",
  },
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
  },
  setProjectModalState: (state, action) => {
    state.projectModalOpen = action.payload;
  },
  setLabelModalState: (state, action) => {
    state.labelModalOpen = action.payload;
  },
  setShowFirstUserState: (state, action) => {
    state.hideFirstUserScreen = action.payload;
  },
  setToast: (state, action) => {
    state.toast = { ...state.toast, ...action.payload };
  },
};
