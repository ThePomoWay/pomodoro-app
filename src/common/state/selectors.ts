import { getTimerString, groupByDates } from "../utils/common";

export const selectPomoState = (state) => state.timer.pomoState;
export const selectTimer        = (state) => state.timer.timerInSec;

export const selectFocusMode = (state) => state.global.focusMode;
export const selectAddTaskBtn = (state) => state.global.showAddTaskBtn;
export const selectTaskToBeEdited = (state) => state.global.taskToBeEdited;

export const selectTodaysTasks = (state) => state.tasks.todaysTasks.map(i => state.tasks.tasks[i]);
export const selectTodaysTaskIds = (state) => state.tasks.todaysTasks;
export const selectAllTasks = (state) => state.tasks.allTasks.map(i => state.tasks.tasks[i]);
export const selectCurrentTask = (state) => {return state.tasks.tasks[state.tasks.currentTaskRef]};
export const selectEditTask = (state) => {return state.tasks.tasks[state.tasks.editTaskRef]};
export const selectTasksByDate = (state) => {return groupByDates(state.tasks.tasks);}