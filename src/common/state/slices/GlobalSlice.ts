import { createSlice } from "@reduxjs/toolkit";
import { globalReducer, initialGlobalState } from "../reducers/GlobalReducer";


export const globalSlice = createSlice({
    name: 'global',
    initialState: initialGlobalState,
    reducers: globalReducer
})

export const {disableFocusMode, enableFocusMode, showTaskModal, hideTaskModal} = globalSlice.actions