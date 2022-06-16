import AuthService from "./AuthService";
import {
  createBillingPortalEndpoint,
  createCheckoutSessionEndpoint,
  getAllProductsEndpoint,
} from "./Endpoints";
import { NetworkService } from "./NetworkService";
import { getIp } from "./SelfIpApi";

export async function getAllProducts() {
  let countryCode = await getIp()
  return NetworkService.get(getAllProductsEndpoint, {
    country: countryCode
  });
}

export function createCheckoutSession(priceId) {
  let endpoint = createCheckoutSessionEndpoint.replace(
    "{userId}",
    AuthService.getUserId()
  );
  let userInfo = AuthService.getUserAuthInfo();
  return NetworkService.post(
    endpoint,
    { priceId },
    {
      uid: AuthService.getUserId(),
      name: "Mukesh",
      email: "ttaison10@gmail.com",
    }
  );
}

export function createBillingConfiguration() {
  let endpoint = createBillingPortalEndpoint.replace(
    "{userId}",
    AuthService.getUserId()
  );
  let userInfo = AuthService.getUserAuthInfo();
  return NetworkService.post(
    endpoint, {}, {});
}



