import { findIndex } from "../../utils/array-utils";
import { getObjFromArr } from "../../utils/common";

export const initialProjectsState = {
  projects: {},
  projectOrder: [],
  editProjectId: "",
};

export const projectReducer = {
  createProject: (state, action) => {
    state.projects[action.payload._id] = action.payload;
    state.projectOrder.push(action.payload._id);
  },
  updateProject: (state, action) => {
    state.projects[action.payload._id] = action.payload;
  },
  deleteProject: (state, action) => {
    delete state.projects[action.payload._id];

    let ind = findIndex(state.projectOrder, action.payload._id);
    state.projectOrder.splice(ind, 1);
  },
  setEditProjectId: (state, action) => {
    state.editProjectId = action.payload;
  },
  setAllProjects: (state, action) => {
    if (action.payload) {
      state.projects = getObjFromArr(action.payload, "_id", true);
      state.projectOrder = action.payload.map((i) => i._id);
    }
  },
};
