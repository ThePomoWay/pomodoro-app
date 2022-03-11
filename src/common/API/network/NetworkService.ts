import env from "../../../env";
import { store } from "../../state/store";
import AuthService, { justLoggedInKey, userAuthInfoLsKey } from "./AuthService";
import {
  isSyncRequired,
  getSyncInfo,
  syncSuccessful,
} from "../../offlineSync/offlineSync";
import { setToast } from "../../state/slice/GlobalSlice";

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

function throwNetworkErrorToast(message) {
  store.dispatch(
    setToast({
      open: true,
      msg: message || "Please check your internet connection",
      duration: 2000,
      type: "failure",
    })
  );
}

export class NetworkService {
  static sync() {
    if (!isSyncRequired()) {
      return Promise.resolve();
    }

    let syncOfflineDataEndpoint = "v1/users/{userId}/sync-offline-data";
    syncOfflineDataEndpoint = syncOfflineDataEndpoint.replace(
      "{userId}",
      AuthService.getUserId()
    );

    var syncBody = getSyncInfo();
    return fetch(getQueryParamString(syncOfflineDataEndpoint, {}), {
      headers: getCommonHeaders(),
      method: "POST",
      body: JSON.stringify(syncBody),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res || res.status !== 200) {
          throwNetworkErrorToast();
          return res;
        }
        syncSuccessful(res.data.mapFIDToTID);
        return res;
      });
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
      .catch(() => {});
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
          .catch(console.error);
      })
      .catch(() => {});
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
          .catch(console.error);
      })
      .catch(() => {});
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
          .catch(console.error);
      })
      .catch(() => {});
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
          .catch(console.error);
      })
      .catch(() => {});
  }

  static async logout() {
    NetworkService.sync()
    .then((resp) => {
      localStorage.removeItem(userAuthInfoLsKey);
      localStorage.removeItem(justLoggedInKey);
      window.location.href = "/";
    })
    .catch(() => {
      throwNetworkErrorToast("You are currently offline and have unsaved data. Please check network connection to not lose on changes before logging out")
    })
  }
}
