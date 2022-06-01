import { PricingCTAs } from "../pricing-ctas/pricing-ctas";

export default function SubscriptionCanceled(props) {
    return (
        <div>
            // Subscription Canceled
            // Inform User that their plan has expired and that they can buy a new one. Show our products. Similar to Unpaid.

            Your subscription expired on {props.planExpiry || <p>"_"</p>}
            <PricingCTAs />
        </div>
    );
}