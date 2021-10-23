import { createSlice } from "@reduxjs/toolkit";
import { globalReducer, initialGlobalState } from "../reducers/GlobalReducer";


export const globalSlice = createSlice({
    name: 'global',
    initialState: initialGlobalState,
    reducers: globalReducer
})


export const {disableFocusMode, enableFocusMode, showAddTaskBtn, hideAddTaskBtn, editTask, clearTaskToBeEdited} = globalSlice.actions