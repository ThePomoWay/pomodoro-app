export default function SubscriptionActive(props) {
    return (
        <div>
            // Subscription Active
            {props.planExpiry || <p>"expiry is empty"</p>}
            // Inform User that their plan is active, show the plan expiry date and option to manage active subscription.
        </div>
    );
}