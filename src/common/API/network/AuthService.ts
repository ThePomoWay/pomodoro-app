import { getCookie } from "../../utils/common";

export default class AuthService {
    static isLoggedIn() {
        return false; // comment later
        return getCookie('isLoggedIn');
    }

    static getUserId() {
        return '4af9f07093317acf62b68073';
    }
}