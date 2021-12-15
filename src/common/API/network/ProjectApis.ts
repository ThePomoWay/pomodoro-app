import AuthService from "./AuthService";
import { createProjectEndpoint, createSectionEndpoint, createTaskEndpoint, deleteProjectEndpoint, updateProjectEndpoint } from "./Endpoints";
import { NetworkService } from "./NetworkService";

export function createProjectApi(project) {
    let endpoint = createProjectEndpoint.replace('{userId}', AuthService.getUserId());

    let body = {
        uid: AuthService.getUserId(),
        title: project.title
    };

    return NetworkService.post(endpoint, {}, body).then((resp => {
        return resp.data.pid;
    }));
}

export function deleteProjectApi(project) {
    let endpoint = deleteProjectEndpoint.replace('{userId}', AuthService.getUserId())
                                        .replace('{projectId}', project.id);
    
    return NetworkService.delete(endpoint);
}

export function updateProjectApi(project) {
    let endpoint = updateProjectEndpoint.replace('{userId}', AuthService.getUserId())
                                        .replace('{projectId}', project.id);
    return NetworkService.patch(endpoint, {}, {
        title: project.title,
        uid: AuthService.getUserId(),
        _id: project.id,
        to: project.taskOrder
    });
}

export function createSectionApi(project) {
    let endpoint = createSectionEndpoint.replace('{userId}', AuthService.getUserId())
                                        .replace('{projectId}', project.id)
    
    
}