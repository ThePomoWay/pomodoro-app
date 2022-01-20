import AuthService from "./AuthService";
import { createTagEndpoint, deleteTagEndpoint, getAllTagsEndpoint } from "./Endpoints";
import { NetworkService } from "./NetworkService";

export function GetAllTagsApi() {
    let endpoint = getAllTagsEndpoint.replace('{userId}', AuthService.getUserId());
    return NetworkService.get(endpoint, {});
}

export function createTagApi(body) {
    let endpoint = createTagEndpoint.replace('{userId}', AuthService.getUserId());
    return NetworkService.post(endpoint, {}, body);
}

export function deleteTagApi(tagId) {
    let endpoint = deleteTagEndpoint.replace('{userId}', AuthService.getUserId())
                                    .replace('{labelId}', tagId);
    return NetworkService.delete(endpoint);
}