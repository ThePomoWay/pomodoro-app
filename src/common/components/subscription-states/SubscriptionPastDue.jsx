import { getBillingConfiguration } from "../../state/thunks/GlobalThunk";
import { useDispatch } from "react-redux";
import styles from "./Subscription.module.scss";
import PricingFeatures from "../pricing-features/pricing-features";
import { PricingCTAs } from "../pricing-ctas/pricing-ctas";

export default function SubscriptionActive(props) {
  let dispatch = useDispatch();

  return (
    <div>
      <div className={styles["title"]}>
        Your Subscription has <span className={styles["red"]}>EXPIRED</span>
      </div>
      <div className={styles["hr"]}></div>
      <div className={styles["expiry-text"]}>
        Your premium membership expired on{" "}
        <span className={styles["red"]}>{props.expiry}</span>
      </div>

      <div className={styles["sub-title"]}>Features</div>

      <PricingFeatures hideHeading={true} />

      <PricingCTAs />
    </div>
  );
}
