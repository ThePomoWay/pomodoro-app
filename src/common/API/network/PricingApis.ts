import AuthService from "./AuthService";
import {
  createCheckoutSessionEndpoint,
  getAllProductsEndpoint,
} from "./Endpoints";
import { NetworkService } from "./NetworkService";

export function getAllProducts() {
  return NetworkService.get(getAllProductsEndpoint, {
    country: AuthService.getCountryCode(),
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
