import { syncEndpoint } from "./Endpoints";
import AuthService from "../network/AuthService";
import { NetworkService } from "./NetworkService";
export function getSyncAPI() {
  let endpoint = syncEndpoint.replace("{userId}", AuthService.getUserId());
  return NetworkService.post(endpoint, {}, {});
}
