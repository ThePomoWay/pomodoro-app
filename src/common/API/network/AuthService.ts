import { getCookie } from "../../utils/common";
import { clearTasksInIDB } from "../indexed-db-ops/crud";

const userAuthInfoLsKey = "userAuthInfo";
const uidKey = "uid";
const justLoggedInKey = "newSignin";

export default class AuthService {
  static isLoggedIn() {
    //return false; // comment later
    // return true;
    let userInfo = AuthService.getUserAuthInfo();
    return !!userInfo.uid;
  }

  static getUserId() {
    let userInfo = AuthService.getUserAuthInfo();
    return userInfo.uid;
  }

  static getInboxProjectId() {
    let userInfo = AuthService.getUserAuthInfo();
    return userInfo.inboxID || "inbox";
  }

  static setUserAuthInfo(value) {
    localStorage.setItem(userAuthInfoLsKey, JSON.stringify(value));
  }

  static getUserAuthInfo() {
    return JSON.parse(localStorage.getItem(userAuthInfoLsKey)) || {};
  }

  static getAuthToken() {
    let userInfo = AuthService.getUserAuthInfo();
    return "Bearer " + userInfo.auth;
  }

  static setJustLoggedIn(value) {
    if (value) {
      localStorage.setItem(justLoggedInKey, value);
    } else {
      localStorage.removeItem(justLoggedInKey);
    }
  }

  static isJustLoggedIn() {
    return Boolean(localStorage.getItem(justLoggedInKey));
  }

  static login(payload) {
    AuthService.setUserAuthInfo(payload);
    AuthService.setJustLoggedIn(true);
    window.location.reload();
  }

  static async logout() {
    localStorage.removeItem(userAuthInfoLsKey);
    localStorage.removeItem(justLoggedInKey);
    window.location.href = "/";
  }
}
