import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectProducts } from "../../state/selectors";
import { buyProductThunk, getProducts } from "../../state/thunks/GlobalThunk";
import { PricingCTAs } from "../pricing-ctas/pricing-ctas";
import PricingFeatures from "../pricing-features/pricing-features";

import styles from "../pricing-modal/PricingModal.module.scss";

export function PricingContainer(props) {
  return (
    <div className={styles["pricing-container"]}>
      <PricingCTAs />
      <PricingFeatures />
    </div>
  );
}
