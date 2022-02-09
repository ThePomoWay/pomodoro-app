import { getTasks } from "../API/APIService";
import { clearTasksInIDB } from "../API/indexed-db-ops/crud";
import {
  clearProjectsFromIDB,
  getAllProjectsFromIDB,
} from "../API/indexed-db-ops/projectCrud";
import { clearTagsFromIDB } from "../API/indexed-db-ops/tagsCrud";
import { getTodaysTasksFromIdb } from "../API/indexed-db-ops/todaysTasks";
import AuthService from "../API/network/AuthService";
import { getAllProjectsApi } from "../API/network/ProjectApis";
import { GetAllTagsApi } from "../API/network/TagsApis";
import {
  addToTodaysTaskAPI,
  createTaskAPI,
  getAllTasksApi,
} from "../API/network/TaskApis";
import {
  createLocalProjectAsync,
  deleteProjectAsync,
  getAllProjects,
  updateLocalProjectAsync,
} from "../state/slices/ProjectSlice";
import { createLocalTagThunk } from "../state/slices/TagsSlice";
import {
  createLocalTaskThunk,
  updateLocalTaskThunk,
} from "../state/slices/TasksSlice";
import { store } from "../state/store";
import { getObjFromArr } from "./common";
import { processBEProject } from "./project-helper-utils";
import { processBETask } from "./task-helper-utils";

export async function syncIdb() {
  if (AuthService.isJustLoggedIn()) {
    let localTasks: any = await getTasks();

    let inboxId = AuthService.getInboxProjectId();

    let projects = await getAllProjectsFromIDB();
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

    //Dump all local tasks to backend which were created before login
    for (let task of localTasks) {
      if (!task._id) {
        task.project.projectID = inboxId;
        let response = await createTaskAPI(task);
        if (response && response.data && response.data.tid) {
          store.dispatch(
            updateLocalTaskThunk({ ...task, _id: response.data.tid })
          );
        } else {
          console.error("Couldn't sync");
          return false;
        }
      }
    }

    //Dump todays task container to be
    let todaysTasks: any = await getTodaysTasksFromIdb();
    let tasksObj = getObjFromArr(await getTasks(), "fid", true);

    let beTodaysTasks = todaysTasks
      .map((item) => tasksObj[item] && tasksObj[item]._id)
      .filter((i) => i);

    for (let taskId of beTodaysTasks) {
      let response = await addToTodaysTaskAPI(taskId);
      if (!response || response.status !== 200) {
        console.error("Error when syncing today's tasks");
        return false;
      }
    }
    // let response = await updateTodaysTaskAPI(beTodaysTasks);

    //dump BE database to IDB
    await syncTags();
    await syncTasks();
    let tasks = await getTasks();
    syncProjects(tasks);

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

export async function syncProjects(taskArr) {
  let response = await getAllProjectsApi();
  if (response && response.data) {
    let res = await clearProjectsFromIDB();
    if (res && res.success) {
      let tasksObj = getObjFromArr(taskArr, "_id", true);
      for (let project of response.data.projects) {
        store.dispatch(
          createLocalProjectAsync({
            project: processBEProject(project, tasksObj),
          })
        );
      }
    }
  }
}

export async function syncTags() {
  let response = await GetAllTagsApi();
  if (response && response.data) {
    let res = await clearTagsFromIDB();
    if (res.success) {
      for (let tag of response.data) {
        store.dispatch(createLocalTagThunk(tag));
      }
    }
  }
}
