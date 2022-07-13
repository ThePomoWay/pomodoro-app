import { getBillingConfiguration } from "../../state/thunks/GlobalThunk";
import { useDispatch } from "react-redux";
import styles from "./Subscription.module.scss";

export default function SubscriptionActive(props) {
  let dispatch = useDispatch();

  function getBillConfigLink() {
    dispatch(getBillingConfiguration());
  }

  return (
    <div>
      <div className={styles["title"]}>Your Plan</div>
      <div className={styles["hr"]}></div>
      <p className={styles["expiry-text"]}>
        Your plan will auto renew on:{"    "}
        <span className={styles["theme"]}>
          {props.expiry || "expiry is empty"}
        </span>
      </p>

      <p className={styles["expiry-text"]}>Manage your premium subscription</p>

      <button className="btn add-task-btn" onClick={getBillConfigLink}>
        Manage
      </button>
    </div>
  );
}
