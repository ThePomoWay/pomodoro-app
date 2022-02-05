import AuthService from "./AuthService";
import { getAllProductsEndpoint, createCheckoutSessionEndpoint, manageBillingPortalEndpoint} from "./Endpoints";
import { NetworkService } from "./NetworkService";

export function getAllProductsApi() {
    let endpoint = getAllProductsEndpoint;
    return NetworkService.get(endpoint);
}

export function createCheckoutSessionApi(priceID) {
    let endpoint = createCheckoutSessionEndpoint.replace('{userId}', AuthService.getUserId());
    return NetworkService.post(endpoint, {priceId: priceID});
}

export function manageBillingPortalApi() {
    let endpoint = manageBillingPortalEndpoint.replace('{userId}', AuthService.getUserId());
    return NetworkService.post(endpoint);
}