import env from "../../../env";
import AuthService from "./AuthService";

function getQueryParamString(e, q) {
    let qString = Object.keys(q).map(i => i + '=' + q[i]).join('&');
    return env.apiEndpoint + e + qString
}

function getCommonHeaders() {
    let headers = new Headers();
    headers.append('time', new Date().toISOString());
    if(AuthService.isLoggedIn()) {
        headers.append('Authorization', AuthService.getAuthToken());
    }
    return headers;
}

export class NetworkService {
    static get(endpoint, query={}) {
        return fetch(getQueryParamString(endpoint, query), {
            headers: getCommonHeaders()
        }).then(res => res.json());
    }

    static post(endpoint, query={}, body={}) {
        try{
        return fetch(getQueryParamString(endpoint, query), {
            method: 'POST',
            body: JSON.stringify(body),
            headers: getCommonHeaders()
        }).then(res => res.json()).catch(console.error);
        }
        catch {
            console.error("error");
        }
    }

    static put(endpoint, query={}, body) {
        return fetch(getQueryParamString(endpoint, query), {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: getCommonHeaders()
        }).then(res => res.json());
    }

    static patch(endpoint, query={}, body) {
        return fetch(getQueryParamString(endpoint, query), {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: getCommonHeaders()
        }).then(res => res.json());
    }

    static delete(endpoint, query={}, body={}) {
        return fetch(getQueryParamString(endpoint, query), {
            method: 'DELETE',
            body: JSON.stringify(body),
            headers: getCommonHeaders()
        }).then(res => res.json());
    }
}