import { responsiveFontSizes } from "@material-ui/core";
import { savePomoSummariesInOfflineStore } from "../../offlineSync/offlineSync";
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
  let statBody = function () {
    return {
      startDate: getFormattedDate(startTime),
      st: startTime,
      et: endTime,
      type,
      isDistracted,
      pomoSummary
    }
  }
  return NetworkService.post(
    endpoint,
    { date: getFormattedDate() },
    statBody()
  )
  .then((resp) => {
    if (!resp || resp.status !== 200) {
      savePomoSummariesInOfflineStore(statBody())
    }
  });
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
