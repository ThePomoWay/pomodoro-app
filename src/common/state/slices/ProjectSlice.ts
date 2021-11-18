import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createIDBProject, getAllProjectsFromIDB, updateIDBProject } from "../../API/indexed-db-ops/projectCrud";
import AuthService from "../../API/network/AuthService";
import { createProjectApi } from "../../API/network/ProjectApis";
import { getObjFromArr } from "../../utils/common";
import { initialProjectsState, projectReducer } from "../reducers/ProjectReducer";

export const createProjectAsync = createAsyncThunk(
    'create/project',
    async (project: any, {dispatch}) => {
        dispatch(createProject(project))

        if(AuthService.isLoggedIn()) {
            let bid = await createProjectApi(project);
            project.id = bid;
        }


        let response = await createIDBProject(project);
        return response;
    }
)

export const updateProjectAsync = createAsyncThunk(
    'update/project',
    async (project, {dispatch}) => {
        dispatch(updateProject(project));
        let response = await updateIDBProject(project);
        return response
    }
);

export const deleteProjectAsync = createAsyncThunk(
    'delete/project',
    async (project, {dispatch}) => {
        dispatch(deleteProject(project));
        let response = await deleteProject(project);
        return response
    }
);

export const addTaskToProject = createAsyncThunk(
    'add/task/project',
    async (obj: any, {dispatch, getState}) => {
        let project = getState()['projects'].projects[obj.projectId];
        dispatch(updateProjectAsync({
            ...project,
            taskOrder: [...project.taskOrder, obj.taskId]
        }))
    }
)

export const getAllProjects = createAsyncThunk(
    'get/project',
    async (_, {dispatch}) => {
        let response = getAllProjectsFromIDB();
        return response;
    }
)

export const projectSlice = createSlice({
    name: 'projectSlice',
    initialState: initialProjectsState,
    reducers: projectReducer,
    extraReducers: (builder) => {
        builder.addCase(getAllProjects.fulfilled, (state: any, action: any) => {
            if(action.payload) {
                state.projects = getObjFromArr(action.payload, 'fid', true);
                state.projectOrder = action.payload.map(i => i.fid);
            }
        })
    }
})

export const {createProject, deleteProject, updateProject} = projectSlice.actions;