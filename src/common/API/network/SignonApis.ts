import {
  googleLoginEndpoint,
  loginEndpoint,
  registerEndpoint,
  resetPassword,
  requestPasswordChangeOTP,
  registerCheckEndpoint,
  facebookLoginEndpoint,
} from "./Endpoints";
import { NetworkService } from "./NetworkService";

export function googleLoginApi(tokenObj) {
  return NetworkService.post(
    googleLoginEndpoint,
    {},
    { tokenId: tokenObj.tokenId }
  );
}

export function facebookLoginApi(accessToken) {
  return NetworkService.post(
    facebookLoginEndpoint,
    {},
    { tokenId: accessToken }
  );
}

export function registerApi(obj) {
  return NetworkService.post(registerEndpoint, {}, obj);
}

export function loginApi(obj) {
  return NetworkService.post(loginEndpoint, {}, obj);
}

export function initiatePasswordChangeApi(obj) {
  return NetworkService.post(requestPasswordChangeOTP, obj, {});
}

export function verifyPasswordResetOTP(obj) {
  return NetworkService.post(resetPassword, {}, obj);
}

export function registerCheckApi(email) {
  return NetworkService.post(registerCheckEndpoint, { email }, {});
}
