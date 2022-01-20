import {getUserEndpoint} from "./Endpoints"
import {NetworkService} from "./NetworkService"

export function getUserApi(uid) {
    let endpoint = getUserEndpoint.replace('{userId}', uid);

    return NetworkService.get(endpoint);
}