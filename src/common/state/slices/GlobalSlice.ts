import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { globalReducer, initialGlobalState } from "../reducers/GlobalReducer";

export let updateFocusModeState = createAsyncThunk(
    'global/focusmode/enable',
    (val, {dispatch}) => {
        if(window && window.postMessage) {
            //@ts-ignore
            window.postMessage({
                action: 'updateFocusModeState',
                data: val
            }, '*');
        }

    }
)

export const globalSlice = createSlice({
    name: 'global',
    initialState: initialGlobalState,
    reducers: globalReducer
})


export const {disableFocusMode, enableFocusMode, showAddTaskBtn, 
    hideAddTaskBtn, editTask, clearTaskToBeEdited,
    setExtensionPresent} = globalSlice.actions