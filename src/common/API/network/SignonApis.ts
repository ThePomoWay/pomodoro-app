import { googleLoginEndpoint } from "./Endpoints";
import { NetworkService } from "./NetworkService";

export function googleLoginApi(tokenObj) {
    let endpoint = googleLoginEndpoint;
    return NetworkService.post(endpoint, {}, tokenObj)
}