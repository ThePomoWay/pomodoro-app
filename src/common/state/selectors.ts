export const selectTasks = (state) => state.tasks.tasks;

export const selectFocusMode = (state) => state.global.focusMode;
export const selectPomoState = (state) => state.timer.pomoState;

export const selectModalState = (state) => state.global.showAddTaskModal;