import { getCookie } from "../../utils/common";

const userAuthInfoLsKey = 'userAuthInfo';
const uidKey = 'uid';
const justLoggedInKey = 'newSignin';

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

    static getProjectId() {
        let userInfo = AuthService.getUserAuthInfo();
        return userInfo.inboxId;
    }

    static setUserAuthInfo(value) {
        localStorage.setItem(userAuthInfoLsKey, JSON.stringify(value));
    }

    static getUserAuthInfo() {
        return JSON.parse(localStorage.getItem(userAuthInfoLsKey)) || {};
    }

    static getAuthToken() {
        let userInfo = AuthService.getUserAuthInfo();
        return 'Bearer ' + userInfo.auth;
    }

    static setJustLoggedIn(value) {
        if(value){
            localStorage.setItem(justLoggedInKey, value);
        }   
        else {
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

    static logout(){
        localStorage.removeItem(userAuthInfoLsKey);
        window.location.reload();
    }
}