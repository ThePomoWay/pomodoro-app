import { useState } from "react";
import { CloseIcon } from "../../svgs/CloseIcon";
import { DESKTOP_PROMOTION_KEY } from "../../utils/constants";
import styles from "./DesktopPromotion.module.scss";

export function DesktopPromotion() {
  let [showToast, setShowToast] = useState(
    localStorage.getItem(DESKTOP_PROMOTION_KEY)
  );

  // setTimeout(() => {
  //   onClick();
  // }, 5000);

  let onClick = () => {
    localStorage.setItem(DESKTOP_PROMOTION_KEY, "false");
    setShowToast("false");
  };

  if (showToast !== "false") {
    return (
      <div className={styles["container"]}>
        <p>
          FocusLounge is better on Desktop. Use task management, website blocking
          and lot more!
        </p>
        <CloseIcon stroke="white" onClick={onClick} />
      </div>
    );
  }
  return <></>;
}
