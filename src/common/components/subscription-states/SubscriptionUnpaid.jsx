export default function SubscriptionUnpaid(props) {
    return (
        <div>
            // Subscription Unpaid
            {props.planExpiry || <p>"expiry is empty"</p>}
            // Inform User that their plan has expired and that they can buy a new one. Show our products
        </div>
    );
}