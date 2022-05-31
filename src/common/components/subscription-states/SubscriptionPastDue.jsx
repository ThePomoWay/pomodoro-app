export default function SubscriptionPastDue(props) {
    return (
        <div>
            // Subscription past due
            {props.planExpiry || <p>"expiry is empty"</p>}
            // Inform User that we are failing to fetch money and ask them to update payment info if required from billing configuration
        </div>
    );
}