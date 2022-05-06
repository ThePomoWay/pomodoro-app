import { groupByDates } from "../utils/common";
import { statsReducer } from "./reducers/StatsReducer";

export const selectPomoState = (state) => state.timer.pomoState;
export const selectTimer = (state) => state.timer.timerInSec;
export const selectCompletedPomos = (state) => state.timer.completedPomos;

//global state
export const selectFocusMode = (state) => state.global.focusMode;
export const selectAddTaskBtn = (state) => state.global.showAddTaskBtn;
export const selectTaskToBeEdited = (state) => state.global.taskToBeEdited;
export const selectIfExtensionInstalled = (state) =>
  state.global.extensionPresent;
export const selectOnboardingOpen = (state) => state.global.onboardingModalOpen;
export const selectNewProjectModal = (state) => state.global.projectModalOpen;
export const selectNewLabelModal = (state) => state.global.labelModalOpen;
export const selectHideFirstUserScreen = (state) =>
  state.global.hideFirstUserScreen;

export const selectToastObj = (state) => state.global.toast;

export const selectTheme = (state) => state.global.theme;

export const selectIsTimerFullScreen = (state) =>
  state.global.isTimerFullScreen;

export const selectSettingsModal = (state) => state.global.settings.showModal;
export const selectSettingsTab = (state) => state.global.settings.tab;
export const selectIsMultiTabAlertModalOpen = (state) =>
  state.global.multiTabAlertModalState;
export const selectIsExtensionModalOpen = (state) =>
  state.global.isExtensionModalOpen;
export const selectHideTodaysCompletedTasks = (state) =>
  state.global.hideTodaysCompletedTasks;
export const selectHideProjectsCompletedTasks = (state) =>
  state.global.hideProjectCompletedTasks;

//todays tasks
export const selectTodaysTasks = (state) =>
  state.tasks.todaysTasks
    .filter((i) => state.tasks.tasks[i])
    .map((i) => state.tasks.tasks[i]);
export const selectTodaysCompletedTasks = (state) =>
  state.tasks.todaysCompletedTasks
    .filter((i) => state.tasks.tasks[i])
    .map((i) => state.tasks.tasks[i]);
export const selectTodaysTaskIds = (state) => state.tasks.todaysTasks;

//tasks
export const selectTasksAsobj = (state) => state.tasks.tasks;
export const selectTasksLength = (state) =>
  Object.keys(state.tasks.tasks).length;

export const selectCurrentTask = (state) => {
  return state.tasks.tasks[state.tasks.currentTaskRef];
};
export const selectEditTask = (state) => {
  return state.tasks.tasks[state.tasks.editTaskRef];
};
export const selectEditTaskRef = (state) => state.tasks.editTaskRef;
export const selectTasksByDate = (state) => {
  return groupByDates(state.tasks.tasks);
};

//Tags
export const selectTagsAsObj = (state) => state.tags.tags;
export const selectTagsAsArr = (state) => Object.values(state.tags.tags);
export const selectEditTagId = (state) => state.tags.editTagId;

export const selectTasksFromTag = (tag) => {
  return (state) => {
    return state.tasks.allTasks
      .filter((i) => !state.tasks.tasks[i].isComplete)
      .filter((i) => state.tasks.tasks[i].labels.find((i) => i === tag))
      .map((i) => state.tasks.tasks[i]);
  };
};

export const selectTasksFromPriority = (priority) => {
  return (state) => {
    return state.tasks.allTasks
      .filter((i) => !state.tasks.tasks[i].isComplete)
      .filter((i) => state.tasks.tasks[i].priority === Number(priority))
      .map((i) => state.tasks.tasks[i]);
  };
};

//projects
export const selectProjectsObj = (state) => state.projects.projects;
export const selectProjectOrder = (state) => state.projects.projectOrder;
export const selectCompletedTaskInProject = (projectId, sectionId) => {
  return (state) => {
    return Object.keys(state.tasks.tasks)
      .filter(
        (item) =>
          state.tasks.tasks[item].isComplete &&
          state.tasks.tasks[item].project.projectID === projectId &&
          state.tasks.tasks[item].project.secID === sectionId
      )
      .map((item) => state.tasks.tasks[item]);
  };
};
export const selectEditProject = (state) => state.projects.editProjectId;
export const selectProjectById = (id) => (state) => state.projects.projects[id];

//clock settings
export const selectDefaultWorkTime = (state) => state.timer.defaultWorkTime;
export const selectDefaultBreakTime = (state) => state.timer.defaultBreakTime;

export const selectDefaultTimes = (state) => {
  return {
    defaultWorkTime: state.global.userPreferences.defaultWorkTime,
    defaultBreakTime: state.global.userPreferences.defaultBreakTime,
    defaultLongBreakTime: state.global.userPreferences.defaultLongBreakTime,
  };
};

export const selectUserPreferences = (state) => state.global.userPreferences;

//Select user info
export const selectIsLoggedIn = (state) => state.user.isLoggedIn;
export const selectUserInfo = (state) => state.user.user;

//onboarding
export const selectStep = (state) => state.onboarding.step;
export const selectPasswordResetEmail = (state) =>
  state.onboarding.passwordResetMail;
export const selectLoginPasswordError = (state) =>
  state.onboarding.loginPasswordError;
export const selectLoginName = (state) => state.onboarding.loginName;
export const selectRegisterEmail = (state) => state.onboarding.registerEmail;

export const selectLastAllTaskUrl = (state) => state.global.lastAllTaskUrl;

export const selectStats = (state) => state.blocker.history;
export const selectBlockedWebsites = (state) => state.blocker.blockedWebsites;
