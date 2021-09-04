export class NetworkService {
    get(endpoint) {
        return fetch(endpoint).then(res => res.json());
    }

    send(endpoint, body) {
        return fetch(endpoint, {
            method: 'POST',
            body
        }).then(res => res.json());
    }
}