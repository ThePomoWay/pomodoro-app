import { findIndex } from "../../utils/array-utils";
import { getFormattedDate } from "../../utils/date-utils";

export const initialTaskState = {
  tasks: {},
  todaysTasks: [],
  todaysCompletedTasks: [],
  allTasks: [],
  currentTaskRef: "",
  editTaskRef: "",
  allCompletedTasks: {
    from: "",
    to: "",
    tasks: [],
  },
};

export let taskReducer = {
  createTask: (state, action) => {
    state.tasks[action.payload.task.fid] = action.payload.task;

    state.allTasks.push(action.payload.task.fid);

    if (action.payload.isCurrentTask) {
      state.currentTaskRef = action.payload.task.fid;
    }
  },
  updateTask: (state, action) => {
    state.tasks[action.payload.fid] = action.payload;
    state.tasks = { ...state.tasks };

    if (action.payload.isCurrentTask) {
      state.currentTaskRef = action.payload.fid;
    }
  },
  deleteTask: (state, action) => {
    delete state.tasks[action.payload.fid];

    let ind = findIndex(state.allTasks, action.payload.fid);
    if (ind !== -1) {
      state.allTasks.splice(ind, 1);
    }

    if (state.currentTaskRef === action.payload.fid) {
      state.currentTaskRef = "";
    }
  },
  markTaskAsComplete: (state, action) => {
    let task = state.tasks[action.payload.fid];
    task.completed = true;
    task.completedOn = new Date();
  },

  taskSelected: (state, action) => {
    if (action.payload && action.payload.fid) {
      for (let fid in state.tasks) {
        if (action.payload.fid === fid) {
          state.tasks[fid].isCurrentTask = true;
          state.currentTaskRef = action.payload.fid;
        } else {
          state.tasks[fid].isCurrentTask = false;
        }
      }
    }
  },
  updateTodaysTasks: (state, action) => {
    state.todaysTasks = action.payload;
  },
  rearrangeTodaysTask: (state, action) => {
    if (action.payload.source !== action.payload.destination) {
      let fid = state.todaysTasks.splice(action.payload.source, 1);
      state.todaysTasks.splice(action.payload.destination, 0, fid);
    }
  },
  rearrangeAllTasks: (state, action) => {
    if (action.payload.source !== action.payload.destination) {
      let fid = state.allTasks.splice(action.payload.source, 1);
      state.allTasks.splice(action.payload.destination, 0, fid);
    }
  },
  removeFromTodaysTasks: (state, action) => {
    if (action.payload.index !== undefined) {
      state.todaysTasks.splice(action.payload.index, 1);
    } else if (action.payload.fid) {
      let index = findIndex(state.todaysTasks, action.payload.fid);
      state.todaysTasks.splice(index, 1);
    }
  },
  removeFromAllTasks: (state, action) => {
    if (action.payload.index !== undefined) {
      state.allTasks.splice(action.payload.index, 1);
    } else if (action.payload.fid) {
      let index = findIndex(state.allTasks, action.payload.fid);
      state.allTasks.splice(index, 1);
    }
  },
  addToTodaysTasks: (state, action) => {
    if (action.payload.index !== undefined) {
      state.todaysTasks.splice(action.payload.index, 0, action.payload.fid);
    } else {
      state.todaysTasks.push(action.payload.fid);
    }
  },
  addToCompletedTasks: (state, action) => {
    state.todaysCompletedTasks.push(action.payload.fid);
  },
  removeFromCompletedTasks: (state, action) => {
    let index = findIndex(state.todaysCompletedTasks, action.payload.fid);
    if (index !== -1) {
      state.todaysCompletedTasks.splice(index, 1);
    }
  },
  addToAllTasks: (state, action) => {
    if (action.payload.index !== null) {
      state.allTasks.splice(action.payload.index, 0, action.payload.fid);
    } else {
      state.allTasks.push(action.payload.fid);
    }
  },
  setEditTask: (state, action) => {
    state.editTaskRef = action.payload;
  },
  setCurrentTaskRef: (state, action) => {
    state.currentTaskRef = action.payload;
  },
  setAllTasks: (state, action) => {
    let todaysFormattedDate = getFormattedDate();
    if (state.todaysCompletedTasks.length === 0) {
      for (let task of action.payload as Array<any>) {
        state.tasks[task.fid] = task;

        if (
          task.isComplete &&
          getFormattedDate(task.completedOn) === todaysFormattedDate
        ) {
          state.todaysCompletedTasks.push(task.fid);
        }
      }
    }

    state.allTasks = Object.keys(state.tasks);

    let currentTask = action.payload.filter((item) => item.isCurrentTask)[0];
    state.currentTaskRef = currentTask && currentTask.fid;
  },
  setTodaysTasks: (state, action) => {
    state.todaysTasks = action.payload;
  },
  incrementCurTaskSec: (state, action) => {
    if (state.currentTaskRef) {
      state.tasks[state.currentTaskRef].summary.csec += 1;
    }
  },
  updateCompletedTasks: (state, action) => {
    state.allCompletedTasks = action.payload;
  },
};
