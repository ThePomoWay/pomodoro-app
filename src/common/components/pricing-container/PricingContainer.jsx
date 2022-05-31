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

import styles from "../pricing-modal/PricingModal.module.scss";

export function PricingContainer(props) {
  let products = useSelector(selectProducts);

  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
  }, []);
  let buyProduct = (item) => {
    dispatch(buyProductThunk(item));
  };

  return (
    <div className={styles["pricing-container"]}>
      <div className={styles["heading"]}>
        Bring more focus to your life with{" "}
        <span className={styles["theme"]}>Premium</span>
      </div>
      <div className={styles["features"]}>
        <div className={styles["feature"]}>
          <div className={styles["svg"]}>
            <PricingNotesIcon />
          </div>
          <div className={styles["text"]}>Create any number of projects</div>
        </div>
        <div className={styles["feature"]}>
          <div className={styles["svg"]}>
            <DarkModeIcon />
          </div>
          <div className={styles["text"]}>Access to sleek dark mode</div>
        </div>
        <div className={styles["feature"]}>
          <div className={styles["svg"]}>
            <PricingModalAnalysisIcon />
          </div>
          <div className={styles["text"]}>
            Access to weekly and monthly insights
          </div>
        </div>
        <div className={styles["feature"]}>
          <div className={styles["svg"]}>
            <PricingModalMusicIcon />
          </div>
          <div className={styles["text"]}>
            Access to multiple sound settings
          </div>
        </div>
        <div className={styles["feature"]}>
          <div className={styles["svg"]}>
            <PricingModalBlockIcon />
          </div>
          <div className={styles["text"]}>
            Block any number of websites in focus mode
          </div>
        </div>
        <div className={styles["feature"]}>
          <div className={styles["svg"]}>
            <PricingModalUnlockIcon />
          </div>
          <div className={styles["text"]}>
            Unlock new features that we release.
          </div>
        </div>
      </div>

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
    </div>
  );
}
