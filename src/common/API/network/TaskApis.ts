import AuthService from "./AuthService";
import { addToTodaysTasksEndpoint, createTaskEndpoint, deleteTaskEndpoint, getTodaysTaskEndpoint, markTaskAsCompleteEndpoint, updateTaskEndpoint } from "./Endpoints";
import { NetworkService } from "./NetworkService";

export function getTodaysTasksAPI() {
    return NetworkService.get(getTodaysTaskEndpoint.replace('{userId}', AuthService.getUserId()))
}

export function updateTaskAPI(taskObj) {
    let endpoint = updateTaskEndpoint.replace('{userId}', AuthService.getUserId())
                                     .replace('{taskId}', taskObj.id);

    return NetworkService.patch(endpoint, {}, taskObj);
}

export function createTaskAPI(taskObj){
    let endpoint = createTaskEndpoint.replace('{userId}', AuthService.getUserId());

    return NetworkService.post(endpoint, {}, taskObj);
}

export function deleteTaskAPI(taskObj) {
    let endpoint = deleteTaskEndpoint.replace('{userId}', AuthService.getUserId())
                                     .replace('{taskId}', taskObj._id);
    return NetworkService.delete(endpoint, {}, taskObj)
}

export function addToTodaysTaskAPI(taskId) {
    let endpoint = addToTodaysTasksEndpoint.replace('{userId}', AuthService.getUserId())
                                           .replace('{taskId}', taskId);
    return NetworkService.post(endpoint, {}, {});
}

export function markTaskAsCompleteApi(taskId) {
    let endpoint = markTaskAsCompleteEndpoint.replace('{userId}', AuthService.getUserId())
                                             .replace('{taskId}', taskId);
    return NetworkService.post(endpoint)
}