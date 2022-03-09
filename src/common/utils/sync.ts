import { getTasks } from "../API/APIService";
import { clearTasksInIDB } from "../API/indexed-db-ops/crud";
import {
  clearProjectsFromIDB,
  getAllProjectsFromIDB,
} from "../API/indexed-db-ops/projectCrud";
import {
  getStatsQueue,
  statsQueueLSKey,
} from "../API/indexed-db-ops/statsQueue";
import { clearTagsFromIDB } from "../API/indexed-db-ops/tagsCrud";
import {
  clearTodaysTasksFromIDB,
  getTodaysTasksFromIdb,
} from "../API/indexed-db-ops/todaysTasks";
import AuthService from "../API/network/AuthService";
import { updateMultipleTimerStatsAPI } from "../API/network/StatsApis";
import { getSyncAPI } from "../API/network/SyncApi";
import { createMultipleTaskAPI, getAllTasksApi } from "../API/network/TaskApis";
import {
  createLocalProjectAsync,
  deleteProjectAsync,
  deleteProjectLocal,
  getAllProjects,
} from "../state/thunks/ProjectThunk";
import { createLocalTagThunk } from "../state/thunks/TagsThunk";
import {
  createLocalTaskThunk,
  setTodaysTaskLocal,
  updateLocalTaskThunk,
} from "../state/thunks/TasksThunk";
import { updateTimerState } from "../state/thunks/TimerThunk";
import { store } from "../state/store";
import { getObjFromArr } from "./common";
import { processBEProject } from "./project-helper-utils";
import { processBETask } from "./task-helper-utils";

export async function syncIdb() {
  if (AuthService.isJustLoggedIn()) {
    let localTasks: any = await getTasks();

    let inboxId = AuthService.getInboxProjectId();

    let userInfo = AuthService.getUserAuthInfo();

    if (userInfo.isNew) {
      let projects = await getAllProjectsFromIDB();
      for (let project of projects) {
        if (project._id === "inbox") {
          store.dispatch(
            createLocalProjectAsync({
              project: {
                ...project,
                _id: AuthService.getInboxProjectId(),
              },
            })
          );

          store.dispatch(deleteProjectLocal(project));

          store.dispatch(getAllProjects());
        }
      }

      //push local updates to server. If not new user then only sync be with local.

      //Dump all local tasks to backend which were created before login
      let tasksArr = [];

      let todaysTasks: any = getObjFromArr(await getTodaysTasksFromIdb());
      for (let task of localTasks) {
        if (!task._id) {
          task.project.projectID = inboxId;
          if (task.fid in todaysTasks) {
            task.isToday = true;
          }
          tasksArr.push(task);
        }
      }

      let tasksObj = getObjFromArr(localTasks, "fid", true);
      if (tasksArr.length > 0) {
        let response = await createMultipleTaskAPI(tasksArr);
        if (response && response.data && response.data.taskMap) {
          for (let fid in response.data.taskMap) {
            if (tasksObj[fid]) {
              tasksObj[fid]._id = response.data.taskMap[fid];
              store.dispatch(updateLocalTaskThunk(tasksObj[fid]));
            }
          }
        } else {
          console.error("Couldn't sync tasks");
          return false;
        }
      }

      //Push stats update queue
      let statsUpdateQueue = getStatsQueue();

      for (let item of statsUpdateQueue) {
        if (item.pomoSummary && item.pomoSummary.length > 0) {
          for (let stat of item.pomoSummary) {
            if (stat.tid && tasksObj[stat.tid] && tasksObj[stat.tid]._id) {
              stat.tid = tasksObj[stat.tid]._id;
            }
          }
        }
      }

      let statsResponse = await updateMultipleTimerStatsAPI({
        stats: statsUpdateQueue,
      });
      if (statsResponse.status !== 200) {
        console.error("Couldn't sync stats");
      } else {
        localStorage.removeItem(statsQueueLSKey);
      }
    } else {
      let syncResponse = await getSyncAPI();
      if (syncResponse.status === 200) {
        await clearTasksInIDB();
        await clearTodaysTasksFromIDB();

        let tasksArr = syncResponse.data.tasks;
        for (let task of tasksArr) {
          task.fid = task._id;
          if (!task.labels) {
            task.labels = [];
          }
          store.dispatch(updateLocalTaskThunk(task));
        }

        let tasksObj = getObjFromArr(tasksArr, "_id", true);

        //sync todays tasks
        if (
          syncResponse.data.todaysTasks &&
          syncResponse.data.todaysTasks.taskIDs
        ) {
          syncResponse.data.todaysTasks.taskIDs =
            syncResponse.data.todaysTasks.taskIDs.filter((i) => !!tasksObj[i]);
          store.dispatch(
            setTodaysTaskLocal(syncResponse.data.todaysTasks.taskIDs)
          );
        }

        syncTags(syncResponse.data.labels);
        // await syncTasks();
        syncProjects(syncResponse.data.projects, tasksObj);

        let completedPomos = syncResponse.data.dailyStat.p;
        store.dispatch(updateTimerState({ completedPomos }));
      } else {
        console.error("Couldn't sync");
      }
    }

    // let projects = await getAllProjectsFromIDB();
    // console.log(projects);
    // for (let project of projects) {
    //   if (project._id === "inbox") {
    //     store.dispatch(
    //       createLocalProjectAsync({
    //         project: {
    //           ...project,
    //           _id: AuthService.getInboxProjectId(),
    //         },
    //       })
    //     );

    //     store.dispatch(deleteProjectAsync(project));

    //     store.dispatch(getAllProjects());
    //   }
    // }

    //Dump todays task container to be
    // let tasksObj = getObjFromArr(await getTasks(), "fid", true);

    // let beTodaysTasks = todaysTasks
    //   .map((item) => tasksObj[item] && tasksObj[item]._id)
    //   .filter((i) => i);

    // for (let taskId of beTodaysTasks) {
    //   let response = await addToTodaysTaskAPI(taskId);
    //   if (!response || response.status !== 200) {
    //     console.error("Error when syncing today's tasks");
    //     return false;
    //   }
    // }
    // let response = await updateTodaysTaskAPI(beTodaysTasks);

    //dump BE database to IDB

    AuthService.setJustLoggedIn(false);
  }
}

export async function syncTasks() {
  let from = new Date("2/1/2000").toISOString();
  let till = new Date().toISOString();
  let response = await getAllTasksApi({ from, till });

  if (response && response.data && response.data.tasks) {
    let resp: any = await clearTasksInIDB();
    if (resp.success) {
      for (let beTask of response.data.tasks) {
        let task = processBETask(beTask);
        store.dispatch(createLocalTaskThunk({ task }));
      }
    }
  }
}

export async function syncProjects(projects, tasksObj) {
  if (projects && projects.length > 0) {
    let res = await clearProjectsFromIDB();
    for (let project of projects) {
      store.dispatch(
        createLocalProjectAsync({
          project: processBEProject(project, tasksObj),
        })
      );
    }
  }
}

export async function syncTags(tags) {
  if (tags && tags.length > 0) {
    let res = await clearTagsFromIDB();
    for (let tag of tags) {
      store.dispatch(createLocalTagThunk(tag));
    }
  }
}
