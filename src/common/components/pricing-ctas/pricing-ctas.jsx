import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectProducts } from "../../state/selectors";
import { buyProductThunk, getProducts } from "../../state/thunks/GlobalThunk";
import { DarkModeIcon } from "../../svgs/DarkModeIcon";
import { PricingModalAnalysisIcon } from "../../svgs/PricingModalAnalysisIcon";
import { PricingModalBlockIcon } from "../../svgs/PricingModalBlockIcon";
import { PricingModalMusicIcon } from "../../svgs/PricingModalMusicIcon";
import { PricingModalUnlockIcon } from "../../svgs/PricingModalUnlockIcon";
import { PricingNotesIcon } from "../../svgs/PricingNotesIcon";
import PricingFeatures from "../pricing-features/pricing-features";

import styles from "../pricing-modal/PricingModal.module.scss";

export function PricingCTAs(props) {
  let products = useSelector(selectProducts);

  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
  }, []);
  let buyProduct = (item) => {
    dispatch(buyProductThunk(item));
  };

  return (
    <div className={styles["pricing-ctas"]}>
        <p className={styles["text"]}>Get the best experience at</p>
        <p className={styles["ctas"]}>
            {products.map((item) => (
            <button
                className="btn btn-save"
                key={item._id}
                onClick={(e) => buyProduct(item)}
            >
                {item.currency} {item.unit_amount / 100} per {item.interval}
            </button>
            ))}
        </p>
    </div>
  );
}
