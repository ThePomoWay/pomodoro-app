import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTasks } from "../API/APIService";

export const getAllTasks = createAsyncThunk(
    'tasks/get',
    async () => {
        let response = await getTasks();
        return response;
    })

