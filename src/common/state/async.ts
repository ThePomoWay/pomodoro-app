import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIService } from "../API/APIService";

export const hydrateIDB = createAsyncThunk(
    'tasks/get',
    async () => {
        let response = await APIService.getTasks();
        return response;
    }
    )