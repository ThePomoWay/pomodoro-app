import { findIndex } from "../../utils/array-utils";
import { getObjFromArr } from "../../utils/common";
import { FREE_PROJECT_COUNT } from "../../utils/constants";

export const initialProjectsState = {
  projects: {},
  projectOrder: [],
  editProjectId: "",
  freeProjects: []
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
  setFreeProjects: (state, action) => {
    let freeProjects = [];
    let projectArray = [];
    action.payload.forEach(element => {
      if (element.title !== "Inbox") {
        projectArray.push({
          _id: element._id,
          title: element.title,
          createdOn: element.createdOn || ""
        })
      }
    });
    // TODO :  sort projects array first
    projectArray.sort(function(a,b){
      return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();
    });
    freeProjects = projectArray.slice(0, FREE_PROJECT_COUNT)
    state.freeProjects = freeProjects;
  },
  addToFreeProjects: (state, action) => {
    if (state.freeProjects.length < FREE_PROJECT_COUNT) {
      state.freeProjects.push(action.payload)
    }
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
