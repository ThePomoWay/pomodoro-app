import { createSlice } from "@reduxjs/toolkit";
import { globalReducer, initialGlobalState } from "../reducers/GlobalReducer";

export const globalSlice = createSlice({
  name: "global",
  initialState: initialGlobalState,
  reducers: globalReducer,
});

export const {
  showAddTaskBtn,
  hideAddTaskBtn,
  editTask,
  clearTaskToBeEdited,
  setExtensionPresent,
  openOnboardingModal,
  closeOnboardingModal,
  setFocusMode,
  setProjectModalState,
  setLabelModalState,
  setFirstUserStep,
  setToast,
  showSuccessToast,
  setTheme,
  setUserPreferences,
  setLastAllTaskUrl,
  showErrorToast,
  setIsTimerFullScreen,
  setSettingsModal,
  setSettingsTab,
  setMultiTabAlertModal,
  setIsExtensionModalOpen,
  setHideProjectsCompletedTasks,
  setHideTodaysCompletedTasks,
} = globalSlice.actions;
