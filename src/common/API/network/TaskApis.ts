import AuthService from "./AuthService";
import {
  addToTodaysTasksEndpoint,
  createMultipleTasksEndpoint,
  createTaskEndpoint,
  deleteTaskEndpoint,
  getAllTasksEndpoint,
  getTodaysTaskEndpoint,
  markTaskAsCompleteEndpoint,
  markTaskAsIncompleteEndpoint,
  updateTaskEndpoint,
} from "./Endpoints";
import { NetworkService } from "./NetworkService";

function transformTask(taskObj) {
  if (taskObj) {
    taskObj.cpomo = 0;
  }
}

export function getTodaysTasksAPI() {
  return NetworkService.get(
    getTodaysTaskEndpoint.replace("{userId}", AuthService.getUserId())
  );
}

export function getAllTasksApi(queryObj = {}) {
  return NetworkService.get(
    getAllTasksEndpoint.replace("{userId}", AuthService.getUserId()),
    queryObj
  );
}

export function updateTaskAPI(taskObj) {
  transformTask(taskObj);
  let endpoint = updateTaskEndpoint
    .replace("{userId}", AuthService.getUserId())
    .replace("{taskId}", taskObj._id);

  return NetworkService.patch(endpoint, {}, taskObj);
}

export function createTaskAPI(taskObj) {
  let endpoint = createTaskEndpoint.replace(
    "{userId}",
    AuthService.getUserId()
  );

  return NetworkService.post(endpoint, {}, taskObj);
}

export function createMultipleTaskAPI(tasksArr) {
  let endpoint = createMultipleTasksEndpoint.replace(
    "{userId}",
    AuthService.getUserId()
  );

  return NetworkService.post(endpoint, {}, { tasks: tasksArr });
}

export function deleteTaskAPI(taskObj, today) {
  transformTask(taskObj);
  let endpoint = deleteTaskEndpoint
    .replace("{userId}", AuthService.getUserId())
    .replace("{taskId}", taskObj._id);
  return NetworkService.delete(endpoint, { today }, taskObj);
}

export function addToTodaysTaskAPI(taskId) {
  let endpoint = addToTodaysTasksEndpoint
    .replace("{userId}", AuthService.getUserId())
    .replace("{taskId}", taskId);
  return NetworkService.post(endpoint, {}, {});
}

export function markTaskAsCompleteApi(taskObj, today, completedOn, taskId) {
  transformTask(taskObj);
  let endpoint = markTaskAsCompleteEndpoint
    .replace("{userId}", AuthService.getUserId())
    .replace("{taskId}", taskId);
  return NetworkService.post(endpoint, { today, completedOn }, taskObj);
}

export function markTaskAsInCompleteApi(taskObj, today, taskId) {
  transformTask(taskObj);
  let endpoint = markTaskAsIncompleteEndpoint
    .replace("{userId}", AuthService.getUserId())
    .replace("{taskId}", taskId);
  return NetworkService.post(endpoint, { today }, taskObj);
}
