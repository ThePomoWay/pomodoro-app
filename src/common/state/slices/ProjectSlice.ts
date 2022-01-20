import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createIDBProject, getAllProjectsFromIDB, updateIDBProject } from "../../API/indexed-db-ops/projectCrud";
import AuthService from "../../API/network/AuthService";
import { createProjectApi, createSectionApi, rearrangeTaskApi } from "../../API/network/ProjectApis";
import { getObjFromArr } from "../../utils/common";
import { initialProjectsState, projectReducer } from "../reducers/ProjectReducer";
import { createLocalTaskThunk } from "./TasksSlice";

export const createLocalProjectAsync = createAsyncThunk(
    'create/project/local',
    async (obj: any, {dispatch}) => {
        dispatch(createProject(obj.project))
        let response = await createIDBProject(obj.project);
    }
)

export const createProjectAsync = createAsyncThunk(
    'create/project',
    async (obj: any, {dispatch}) => {
        dispatch(createLocalProjectAsync(obj));

        if(AuthService.isLoggedIn()) {
            let bid = await createProjectApi(obj.project);
            dispatch(updateProjectAsync({
                ...obj.project,
                _id: bid
            }));
        }

        return obj;
    }
)

export const createSectionAsync = createAsyncThunk(
    'create/section',
    async (obj: any, {dispatch}) => {

        let sectionOrderCopy = JSON.parse(JSON.stringify(obj.project.so));
        sectionOrderCopy.splice(obj.section.index, 0, obj.section.fid);

        let sectionObj = {
            ...obj.project.sections,
            [obj.section.fid]: {
                fid: obj.section.fid,
                title: obj.section.title,
                to: obj.section.to
            }
            
        }

        if(AuthService.isLoggedIn()) {
            let response = await createSectionApi(obj.project, obj.section);
            if(response && response.data && response.data.secId) {
                sectionObj[obj.section.fid]['_id'] = response.data.secId;
            }
        }

        dispatch(updateProjectAsync({
            ...obj.project,
            sections: sectionObj,
            so: sectionOrderCopy
        }))

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

export const rearrangeTaskInProjectAsync = createAsyncThunk(
    'tasks/project/rearrange',
    async (obj, {dispatch}) => {
        let response = await rearrangeTaskApi(obj);
    }
)

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
        .addCase(createProjectAsync.fulfilled, (state: any, action: any) => {
            if(action.payload) {
                window.location.href = `${action.payload.path}/${action.payload.project.fid}`;
            }
        })
    }
})

export const {createProject, deleteProject, updateProject} = projectSlice.actions;