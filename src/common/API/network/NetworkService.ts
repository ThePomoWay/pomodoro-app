import env from "../../../env";
import { setToast } from "../../state/slices/GlobalSlice";
import { store } from "../../state/store";
import AuthService from "./AuthService";
import { isSyncRequired, getSyncInfo, syncSuccessful} from "../../offlineSync/offlineSync";

function getQueryParamString(e, q) {
  let qString = Object.keys(q)
    .map((i) => i + "=" + q[i])
    .join("&");
  if (qString.length > 0) {
    return env.apiEndpoint + e + "?" + qString;
  }
  return env.apiEndpoint + e;
}

function getCommonHeaders() {
  let headers = new Headers();
  headers.append("time", new Date().toISOString());
  if (AuthService.isLoggedIn()) {
    headers.append("Authorization", AuthService.getAuthToken());
  }
  return headers;
}

function throwNetworkErrorToast() {
  store.dispatch(setToast({
      open: true,
      msg: "Please check your internet connection",
      duration: 5000,
      type: "failure",
    })
  );
}

export class NetworkService {
  static sync() {
    if (!isSyncRequired) {
      return
    }

    const syncOfflineDataEndpoint = "v1/users/{userId}/sync-offline-data"
    syncOfflineDataEndpoint.replace('{userId}', AuthService.getUserId())

    var syncBody = getSyncInfo()
    return fetch(getQueryParamString(syncOfflineDataEndpoint, {}), {
      headers: getCommonHeaders(),
      method: "POST",
      body: JSON.stringify(syncBody),
    })
    .then((res) => res.json())
    .then(
      (res) => {
        if(res.status !== 200) { 
          throwNetworkErrorToast()
          Promise.reject(); 
          return res
        }
        syncSuccessful(res.data.mapFIDtoTID)
      }
    );
  }

  static get(endpoint, query = {}) {
    return NetworkService.sync()
    .then(() => {
      return fetch(getQueryParamString(endpoint, query), {
        headers: getCommonHeaders(),
      })
      .then((res) => res.json())
      .catch(console.error);
    })
    .catch(() => {})
  }

  static post(endpoint, query = {}, body = {}) {
    return NetworkService.sync()
    .then(() => {
      return fetch(getQueryParamString(endpoint, query), {
        method: "POST",
        body: JSON.stringify(body),
        headers: getCommonHeaders(),
      })
      .then((res) => res.json())
      .catch(console.error)
    })
    .catch(() => {})
  }

  static put(endpoint, query = {}, body) {
    return NetworkService.sync()
    .then(() => {
      return fetch(getQueryParamString(endpoint, query), {
        method: "PUT",
        body: JSON.stringify(body),
        headers: getCommonHeaders(),
      })
      .then((res) => res.json())
      .catch(console.error)
    })
    .catch(() => {})
  }

  static patch(endpoint, query = {}, body) {
    return NetworkService.sync()
    .then(() => {
      return fetch(getQueryParamString(endpoint, query), {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: getCommonHeaders(),
      })
      .then((res) => res.json())
      .catch(console.error)
    })
    .catch(() => {})
  }

  static delete(endpoint, query = {}, body = {}) {
    return NetworkService.sync()
    .then(() => {
      return fetch(getQueryParamString(endpoint, query), {
        method: "DELETE",
        body: JSON.stringify(body),
        headers: getCommonHeaders(),
      })
      .then((res) => res.json())
      .catch(console.error)
    })
    .catch(() => {})
  }
}
