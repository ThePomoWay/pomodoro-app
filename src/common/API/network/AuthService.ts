export const userAuthInfoLsKey = "userAuthInfo";
const uidKey = "uid";
export const justLoggedInKey = "newSignin";

export default class AuthService {
  static isLoggedIn() {
    //return false; // comment later
    // return true;
    let userInfo = AuthService.getUserAuthInfo();
    return !!userInfo.uid;
  }

  static getCountryCode() {
    let cc = localStorage.getItem("cc");

    return cc || "US";
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
}
