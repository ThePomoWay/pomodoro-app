import AuthService from "./AuthService";
import { getUserEndpoint, updateUserEndpoint } from "./Endpoints";
import { NetworkService } from "./NetworkService";

export function getUserApi(uid) {
  let endpoint = getUserEndpoint.replace("{userId}", uid);

  return NetworkService.get(endpoint);
}

export function updateUserApi(body) {
  let endpoint = updateUserEndpoint.replace(
    "{userId}",
    AuthService.getUserId()
  );
  return NetworkService.patch(endpoint, {}, body);
}
