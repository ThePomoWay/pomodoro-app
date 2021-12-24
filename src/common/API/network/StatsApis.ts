import AuthService from "./AuthService";
import { getStatsEndpoint, updateStatsEndpoint } from "./Endpoints";
import { NetworkService } from "./NetworkService";

export function updateTimerStatsAPI(startTime, endTime, type, isDistracted) {
    let endpoint = updateStatsEndpoint.replace('{userId}', AuthService.getUserId())
    return NetworkService.post(endpoint, {date: new Date().toISOString()}, {
        st: startTime,
        et: endTime,
        type,
        isDistracted
    })
}

export function getStatsApi(from, to) {
    let endpoint = getStatsEndpoint.replace('{userId}', AuthService.getUserId());
    return NetworkService.get(endpoint, {from, to});
}
