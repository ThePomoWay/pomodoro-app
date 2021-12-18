import { getCookie } from "../../utils/common";

const bearerLSKey = 'token';
const uidKey = 'uid';

export default class AuthService {
    static isLoggedIn() {
        //return false; // comment later
        return true;
        return getCookie('isLoggedIn');
    }

    static getUserId() {
        return '61b585fb4e5283002df9e593';
    }

    static getProjectId() {
        return '61b585fb4e5283002df9e594';
    }

    static setAuthToken(value) {
        localStorage.setItem(bearerLSKey, value);
    }

    static setUserId(value) {
        localStorage.setItem(uidKey, value);
    }

    static getAuthToken() {
        return 'Bearer' + localStorage.getItem(bearerLSKey);
    }

    static logout(){

    }
}