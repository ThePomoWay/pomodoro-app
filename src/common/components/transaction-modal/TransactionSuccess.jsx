import styles from "./TransactionSuccess.module.scss";
import { ReactComponent as Tick } from "../../svgs/transaction-tick.svg";
import { ReactComponent as Ribbon1 } from "../../svgs/pricing-ribbon.svg";
import { ReactComponent as Ribbon2 } from "../../svgs/pricing-ribbon-2.svg";
import { ReactComponent as Ribbon3 } from "../../svgs/pricing-ribbon-3.svg";
import { ReactComponent as Ribbon4 } from "../../svgs/pricing-ribbon-4.svg";

export function TransactionSuccess(props) {
  return (
    <div className={styles["container"]}>
      <span className={styles["ribbon-1"]}>
        <Ribbon1 />
      </span>
      <span className={styles["ribbon-2"]}>
        <Ribbon2 />
      </span>
      <span className={styles["ribbon-3"]}>
        <Ribbon3 />
      </span>
      <span className={styles["ribbon-4"]}>
        <Ribbon4 />
      </span>

      <span className={styles["rectangle-1"]}></span>
      <span className={styles["rectangle-2"]}></span>

      <span className={styles["dot-container"]}>
        <div className={styles["dot-row"]}>
          <span className={styles["dot"]}></span>
          <span className={styles["dot"]}></span>
          <span className={styles["dot"]}></span>
          <span className={styles["dot"]}></span>
        </div>
        <div className={styles["dot-row"]}>
          <span className={styles["dot"]}></span>
          <span className={styles["dot"]}></span>
          <span className={styles["dot"]}></span>
          <span className={styles["dot"]}></span>
        </div>
        <div className={styles["dot-row"]}>
          <span className={styles["dot"]}></span>
          <span className={styles["dot"]}></span>
          <span className={styles["dot"]}></span>
          <span className={styles["dot"]}></span>
        </div>
      </span>
      <div className={styles["title"]}>Transaction</div>
      <div className={styles["title-theme"]}>Success!</div>

      <p className={styles["sub-text"]}>UNINTERRUPTED SESSIONS</p>
      <p className={styles["sub-text"]}>UNLIMITED ACCESS</p>

      <div className={styles["circle-1"]}>
        <div className={styles["circle-2"]}>
          <div className={styles["circle-3"]}>
            <Tick />
          </div>
        </div>
      </div>
      <button className="btn add-task-btn" onClick={props.handleClose}>
        Close
      </button>
    </div>
  );
}
