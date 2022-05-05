import {
  DEFAULT_BREAK_TIME,
  DEFAULT_LONG_BREAK_TIME,
  DEFAULT_WORK_TIME,
  THEME_LIGHT,
} from "../../utils/constants";

export const initialGlobalState = {
  focusMode: false,
  showAddTaskBtn: false,
  taskToBeEdited: {},
  extensionPresent: false,
  onboardingModalOpen: false,
  projectModalOpen: false,
  labelModalOpen: false,
  pricingModalOpen: true,
  hideFirstUserScreen: false,
  toast: {
    open: false,
    msg: "Todays tasks have been deleted successfully",
    duration: 5000,
    type: "success",
  },
  theme: THEME_LIGHT,
  userPreferences: {
    defaultWorkTime: DEFAULT_WORK_TIME,
    defaultBreakTime: DEFAULT_BREAK_TIME,
    defaultLongBreakTime: DEFAULT_LONG_BREAK_TIME,
    autoplayPomo: false,
    autoplayBreak: false,
  },
  lastAllTaskUrl: window.location.pathname.startsWith("/all")
    ? window.location.pathname
    : "/all",
  isTimerFullScreen: false,
  settings: {
    showModal: false,
    tab: 0,
  },
  multiTabAlertModalState: false,
  hideTodaysCompletedTasks: false,
  hideProjectCompletedTasks: false,
  products: [],
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
  showSuccessToast: (state, action) => {
    state.toast = {
      ...state.toast,
      open: true,
      msg: action.payload,
    };
  },
  showErrorToast: (state, action) => {
    state.toast = {
      ...state.toast,
      open: true,
      msg: action.payload,
      type: "failure",
    };
  },
  setTheme: (state, action) => {
    state.theme = action.payload;
  },
  setUserPreferences: (state, action) => {
    state.userPreferences = { ...state.userPreferences, ...action.payload };
  },
  setLastAllTaskUrl: (state, action) => {
    state.lastAllTaskUrl = action.payload;
  },
  setIsTimerFullScreen: (state, action) => {
    state.isTimerFullScreen = action.payload;
  },
  setSettingsModal: (state, action) => {
    state.settings.showModal = action.payload;
  },
  setSettingsTab: (state, action) => {
    state.settings.tab = action.payload;
  },
  setMultiTabAlertModal: (state, action) => {
    state.multiTabAlertModalState = action.payload;
  },
  setHideTodaysCompletedTasks: (state, action) => {
    state.hideTodaysCompletedTasks = action.payload;
  },
  setHideProjectsCompletedTasks: (state, action) => {
    state.hideProjectCompletedTasks = action.payload;
  },
  setPricingModalState: (state, action) => {
    state.pricingModalOpen = action.payload;
  },
  setProducts: (state, action) => {
    state.products = action.payload;
  },
};
