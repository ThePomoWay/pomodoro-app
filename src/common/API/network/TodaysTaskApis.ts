import AuthService from "./AuthService";
import { getTodaysTasksEndpoint, removeFromTodaysTasksEndpoint, updateTodaysTasksEndpoint } from "./Endpoints";
import { NetworkService } from "./NetworkService";

export function getTodaysTasksApi() {
    let endpoint = getTodaysTasksEndpoint.replace('{userId}', AuthService.getUserId());
    return NetworkService.get(endpoint);
}

export function removeFromTodaysTasksApi(taskId) {
    let endpoint = removeFromTodaysTasksEndpoint.replace('{userId}', AuthService.getUserId())
                                                .replace('{taskId}', taskId);
    return NetworkService.delete(endpoint);
}

export function updateTodaysTaskAPI(taskIdArr) {
    let endpoint = updateTodaysTasksEndpoint.replace('{userId}', AuthService.getUserId())
    return NetworkService.patch(endpoint, {}, {taskIds: taskIdArr})
}