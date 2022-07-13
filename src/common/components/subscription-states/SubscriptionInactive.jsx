import { PricingCTAs } from "../pricing-ctas/pricing-ctas";
import PricingFeatures from "../pricing-features/pricing-features";
import styles from "./Subscription.module.scss";

export default function SubscriptionInactive(props) {
  return (
    <div>
      <div className={styles["title"]}>Upgrade to Premium</div>
      <div className={styles["hr"]}></div>
      <div className={styles["sub-title"]}>Features</div>

      <PricingCTAs />
      <PricingFeatures hideHeading={true} />
    </div>
  );
}
