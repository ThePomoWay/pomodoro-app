import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getStatsApi } from "../../API/network/StatsApis";
import { getFormattedDate } from "../../utils/date-utils";
import { initialStatsState, statsReducer } from "../reducers/StatsReducer";
import { processStats } from "./StatsSliceHelper";

export let getStatsAsync = createAsyncThunk(
    'stats/get',
    async (obj: any, { dispatch, getState }) => {
        let today = new Date();
        let defaultStartDate = new Date(new Date().setDate(today.getDate() - 1));
        let defaultEndDate = new Date().setHours(23, 59, 59, 999);

        if (!obj.from) {
            obj.from = defaultStartDate;
        }
        if (!obj.to) {
            obj.to = defaultEndDate;
        }

        obj.from = getFormattedDate(obj.from);
        obj.to = getFormattedDate(obj.to);

        let response = await getStatsApi(obj.from, obj.to);

        return {from: obj.from, to: obj.to, stats: response.data.stats};

    }
)

export let statsSlice = createSlice({
    name: 'statsSlice',
    initialState: initialStatsState,
    reducers: statsReducer,
    extraReducers: (builder) => {
        builder.addCase(getStatsAsync.fulfilled, (state, action) => {
            state.loaded = true;
            if (!action.payload.stats) {
                return;
            }
            let [oldStatsProcessed, curStatsProcessed] = processStats(action.payload.from, action.payload.to, action.payload.stats);
            //@ts-ignore
            state.oldStats = oldStatsProcessed;
            //@ts-ignore
            state.stats = curStatsProcessed;
        })
    }
})