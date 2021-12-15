import { getCookie } from "../../utils/common";

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
}