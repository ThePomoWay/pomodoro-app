import { createAsyncThunk } from "@reduxjs/toolkit";
import { getStatsApi } from "../../API/network/StatsApis";
import { getAllTasksApi } from "../../API/network/TaskApis";
import { getFormattedDate } from "../../utils/date-utils";
import { setAllStats } from "../slice/StatsSlice";
import { processStats } from "./StatsSliceHelper";

export let getStatsAsync = createAsyncThunk(
  "stats/get",
  async (obj: any, { dispatch, getState }) => {
    let today = new Date();
    let defaultStartDate = new Date(new Date().setDate(today.getDate() - 1));
    let defaultEndDate = new Date().setHours(23, 59, 59, 999);
    let defaultMidDate = new Date().setHours(0, 0, 0, 0);

    if (!obj.from) {
      obj.from = defaultStartDate;
    }
    if (!obj.to) {
      obj.to = defaultEndDate;
    }
    if (!obj.mid) {
      obj.mid = defaultMidDate;
    }

    let response = await getStatsApi(
      getFormattedDate(obj.from),
      getFormattedDate(obj.to)
    );
    let completedTasksResponse = await getAllTasksApi({
      from: new Date(obj.mid).toISOString(),
      till: new Date(obj.to).toISOString(),
      completed: true,
    });

    let completedTasks = [];
    if (completedTasksResponse.status === 200) {
      completedTasks = completedTasksResponse.data.tasks;
    }
    let defaultWorkTime = getState()["timer"].defaultWorkTime;

    let [oldStatsProcessed, curStatsProcessed] = processStats(
      obj.from,
      obj.to,
      response.data.stats,
      defaultWorkTime,
      completedTasks
    );

    dispatch(
      setAllStats({ oldStats: oldStatsProcessed, stats: curStatsProcessed })
    );
  }
);
