import { findIndex } from "../../utils/array-utils";

export const initialProjectsState = {
    projects: {},
    projectOrder: [],
    editProjectId: ''
}

export const projectReducer = {
    createProject: (state, action) => {
        state.projects[action.payload.fid] = action.payload;
        state.projectOrder.push(action.payload.fid)
    },
    updateProject: (state, action) => {
        state.projects[action.payload.fid] = action.payload;
    },
    deleteProject: (state, action) => {
        delete state.projects[action.payload.fid];

        let ind = findIndex(state.projectOrder, action.payload.fid);
        state.projectOrder.splice(ind, 1);
    },
    setEditProjectId: (state, action) => {
        state.editProjectId = action.payload;
    }
}