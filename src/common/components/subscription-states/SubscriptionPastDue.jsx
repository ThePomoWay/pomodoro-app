import { getBillingConfiguration } from "../../state/thunks/GlobalThunk";
import { useDispatch } from "react-redux";

export default function SubscriptionActive(props) {
    let dispatch = useDispatch();

    function getBillConfigLink() {
        dispatch(getBillingConfiguration())
    }

    return (
        <div>
            // Subscription Past Due
            // Inform User that we are failing to fetch money and ask them to update payment info if required from billing configuration

            <p> Your plan will auto renew on {props.planExpiry || "expiry is empty"} </p>

            <button onClick={getBillConfigLink()}> Manage Payment </button>
        </div>
    );
}