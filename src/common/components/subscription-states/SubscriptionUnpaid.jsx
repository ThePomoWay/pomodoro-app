import { PricingCTAs } from "../pricing-ctas/pricing-ctas";
import PricingFeatures from "../pricing-features/pricing-features";
import styles from "./Subscription.module.scss";

export default function SubscriptionUnpaid(props) {
  return (
    <div>
      <div className={styles["title"]}>
        Your Subscription is <span className={styles["red"]}>UNPAID</span>
      </div>
      <div className={styles["hr"]}></div>

      <div className={styles["sub-title"]}>Features</div>

      <PricingFeatures hideHeading={true} />

      <PricingCTAs />
    </div>
  );
}
