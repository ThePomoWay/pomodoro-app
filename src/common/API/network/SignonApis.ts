import { googleLoginEndpoint, loginEndpoint, registerEndpoint } from "./Endpoints";
import { NetworkService } from "./NetworkService";

export function googleLoginApi(tokenObj) {

    return NetworkService.post(googleLoginEndpoint, {}, {tokenId: tokenObj.tokenId});
}

export function registerApi(obj) {
    return NetworkService.post(registerEndpoint, {}, obj);
}

export function loginApi(obj) {
    return NetworkService.post(loginEndpoint, {}, obj);
}