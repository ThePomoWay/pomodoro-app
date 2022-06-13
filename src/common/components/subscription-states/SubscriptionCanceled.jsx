import { PricingCTAs } from "../pricing-ctas/pricing-ctas";
import PricingFeatures from "../pricing-features/pricing-features";
import styles from "./Subscription.module.scss";

export default function SubscriptionCanceled(props) {
  return (
    <div>
      <div className={styles["title"]}>
        Your Subscription has been{" "}
        <span className={styles["red"]}>CANCELLED</span>
      </div>
      <div className={styles["hr"]}></div>
      <div className={styles["expiry-text"]}>
        Your premium membership will expire on{" "}
        <span className={styles["red"]}>{props.expiry}</span>
      </div>

      <div className={styles["sub-title"]}>Features</div>

      <PricingFeatures hideHeading={true} />

      <PricingCTAs />
    </div>
  );
}
