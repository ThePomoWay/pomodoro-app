import { PricingCTAs } from "../pricing-ctas/pricing-ctas";
import PricingFeatures from "../pricing-features/pricing-features";

import styles from "../pricing-modal/PricingModal.module.scss";

export function PricingContainer(props) {
  return (
    <div className={styles["pricing-container"]}>
      <PricingFeatures />
      <PricingCTAs />
    </div>
  );
}
