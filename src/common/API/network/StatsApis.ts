import { getFormattedDate } from "../../utils/date-utils";
import AuthService from "./AuthService";
import {
  getStatsEndpoint,
  updateMultipleStatsEndpoint,
  updateStatsEndpoint,
} from "./Endpoints";
import { NetworkService } from "./NetworkService";

export function updateTimerStatsAPI(
  startTime,
  endTime,
  type,
  isDistracted,
  pomoSummary
) {
  let endpoint = updateStatsEndpoint.replace(
    "{userId}",
    AuthService.getUserId()
  );
  let today = new Date();
  return NetworkService.post(
    endpoint,
    { date: getFormattedDate() },
    {
      startDate: getFormattedDate(startTime),
      st: startTime,
      et: endTime,
      type,
      isDistracted,
      pomoSummary,
    }
  );
}

export function updateMultipleTimerStatsAPI(body) {
  let endpoint = updateMultipleStatsEndpoint.replace(
    "{userId}",
    AuthService.getUserId()
  );
  return NetworkService.post(endpoint, {}, body);
}

export function getStatsApi(from, till) {
  let endpoint = getStatsEndpoint.replace("{userId}", AuthService.getUserId());
  return NetworkService.get(endpoint, { from, till });
}
