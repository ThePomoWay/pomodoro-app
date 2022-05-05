/* eslint-disable jsx-a11y/accessible-emoji */

import Modal from "@mui/material/Modal";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { getAllProducts } from "../../API/network/PricingApis";
import { selectPricingModalOpen, selectProducts } from "../../state/selectors";
import { setPricingModalState } from "../../state/slice/GlobalSlice";
import { buyProductThunk, getProducts } from "../../state/thunks/GlobalThunk";
import { CloseIcon } from "../../svgs/CloseIcon";
import { DarkModeIcon } from "../../svgs/DarkModeIcon";
import { PricingModalAnalysisIcon } from "../../svgs/PricingModalAnalysisIcon";
import { PricingModalBlockIcon } from "../../svgs/PricingModalBlockIcon";
import { PricingModalMusicIcon } from "../../svgs/PricingModalMusicIcon";
import { PricingModalUnlockIcon } from "../../svgs/PricingModalUnlockIcon";
import { PricingNotesIcon } from "../../svgs/PricingNotesIcon";

import styles from "./PricingModal.module.scss";

export default function PricingModal(props) {
  let dispatch = useDispatch();

  let isModalOpen = useSelector(selectPricingModalOpen);
  let products = useSelector(selectProducts);

  let handleClose = () => {
    dispatch(setPricingModalState(false));
  };

  let buyProduct = (item) => {
    dispatch(buyProductThunk(item));
  };

  const isMobileDevice = useMediaQuery({
    query: "(max-device-width: 1224px)",
  });

  const isDesktop = useMediaQuery({
    query: "(min-device-width: 1200px)",
  });

  useEffect(() => {
    dispatch(getProducts());
  }, []);

  return (
    <Modal
      open={isModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div
        className={
          isMobileDevice ? "modal-container-mobile" : "modal-container"
        }
      >
        <div className="modal-content">
          <span className="close" onClick={(e) => handleClose()}>
            <CloseIcon />
          </span>
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
                <div className={styles["text"]}>
                  Create any number of projects
                </div>
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
                    onClick={(e) => buyProduct(item)}
                  >
                    {item.currency} {item.unit_amount / 100} per {item.interval}
                  </button>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
