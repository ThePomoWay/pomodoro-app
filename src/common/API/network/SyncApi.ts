import { syncEndpoint } from "./Endpoints";
import AuthService from "../network/AuthService";
import { NetworkService } from "./NetworkService";
import { getFormattedDate } from "../../utils/date-utils";
export function getSyncAPI() {
  let endpoint = syncEndpoint.replace("{userId}", AuthService.getUserId());
  return NetworkService.get(endpoint, { date: getFormattedDate() });
}
