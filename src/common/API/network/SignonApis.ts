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

export function googleLoginApi(tokenObj, countryCode) {
  return NetworkService.post(
    googleLoginEndpoint,
    {
      country: countryCode
    },
    { tokenId: tokenObj.tokenId }
  );
}

export function facebookLoginApi(accessToken, countryCode) {
  return NetworkService.post(
    facebookLoginEndpoint,
    {
      country: countryCode
    },
    { tokenId: accessToken }
  );
}

export function registerApi(obj, countryCode) {
  obj.country = countryCode || ""
  return NetworkService.post(registerEndpoint, {}, obj);
}

export function loginApi(obj, countryCode) {
  obj.country = countryCode || ""
  return NetworkService.post(loginEndpoint, {}, obj);
}

export function initiatePasswordChangeApi(obj) {
  return NetworkService.post(requestPasswordChangeOTP, obj, {});
}

export function verifyPasswordResetOTP(obj) {
  return NetworkService.post(resetPassword, {}, obj);
}

export function registerCheckApi(email) {
  return NetworkService.post(registerCheckEndpoint, { email }, {}, false);
}
