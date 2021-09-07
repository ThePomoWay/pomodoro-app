


export const selectPomoState = (state) => state.timer.pomoState;

export const selectFocusMode = (state) => state.global.focusMode;
export const selectModalState = (state) => state.global.showAddTaskModal;
export const selectTaskToBeEdited = (state) => state.global.taskToBeEdited;

export const selectTasks = (state) => state.tasks.tasks;
export const selectCurrentTask = (state) => {return state.tasks.filter(item => item.isCurrentTask)[0] || state.tasks[0]};