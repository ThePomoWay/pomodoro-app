export default function SubscriptionCanceled(props) {
    return (
        <div>
            // Subscription Canceled
            {props.planExpiry || <p>"expiry is empty"</p>}
            // Inform User that their plan has expired and that they can buy a new one. Show our products. Similar to Unpaid.
        </div>
    );
}