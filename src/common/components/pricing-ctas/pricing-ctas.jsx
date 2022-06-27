import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectProducts } from "../../state/selectors";
import { buyProductThunk, getProducts } from "../../state/thunks/GlobalThunk";
import { CURRENCY_MAP } from "../../utils/constants";

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

  console.log(products);

  return (
    <div className={styles["pricing-ctas"]}>
      <p className={styles["text"]}>Choose your plan</p>
      <p className={styles["products"]}>
        {products.map((item) => (
          <div className={styles["product"]}>
            <div className={styles["name"]}>
              {item.name || "monthly package"}
            </div>
            <div className={styles["price"]}>
              <span className={styles["currency"]}>
                {CURRENCY_MAP[item.currency] || "$"}
              </span>
              {item.unit_amount / 100}
            </div>
            <button
              className={`btn btn-save ${styles["cta"]}`}
              key={item._id}
              onClick={(e) => buyProduct(item)}
            >
              Buy
            </button>
          </div>
        ))}
      </p>
    </div>
  );
}
