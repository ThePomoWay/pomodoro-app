import { PricingCTAs } from "../pricing-ctas/pricing-ctas";

export default function SubscriptionUnpaid(props) {
    return (
        <div>
            // Subscription Unpaid
            // Inform User that their plan has expired and that they can buy a new one. Show our products

            Your subscription expired on {props.planExpiry || <p>"_"</p>}
            <PricingCTAs />
        </div>
    );
}

