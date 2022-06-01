import { getBillingConfiguration } from "../../state/thunks/GlobalThunk";
import { useDispatch } from "react-redux";

export default function SubscriptionActive(props) {
    let dispatch = useDispatch();

    function getBillConfigLink() {
        dispatch(getBillingConfiguration())
    }

    return (
    <div>
            // Subscription Active
            // Inform User that their plan is active, show the plan expiry date and option to manage active subscription.

            <p> Your plan will auto renew on {props.planExpiry || "expiry is empty"} </p>

            <button onClick={getBillConfigLink()}> Manage Payment </button>
        </div>
    );
}