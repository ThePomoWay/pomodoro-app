import styles from "./TransactionSuccess.module.scss";
import { ReactComponent as Cross } from "../../svgs/pricing-cross.svg";

export function TransactionFailure(props) {
  return (
    <div className={styles["container"]}>
      <div className={styles["dot-cross-container"]}>
        <div className={styles["dot-row"]}>
          <span className={styles["dot-failure"]}></span>
          <Cross />
        </div>
        <div className={styles["dot-row"]}>
          <span className={styles["dot-failure"]}></span>
          <Cross />
        </div>
        <div className={styles["dot-row"]}>
          <span className={styles["dot-failure"]}></span>
          <Cross />
        </div>
        <div className={styles["dot-row"]}>
          <span className={styles["dot-failure"]}></span>
          <Cross />
        </div>
        <div className={styles["dot-row"]}>
          <span className={styles["dot-failure"]}></span>
          <Cross />
        </div>
        <div className={styles["dot-row"]}>
          <span className={styles["dot-failure"]}></span>
          <Cross />
        </div>
      </div>
      <div className={styles["dot-cross-container-2"]}>
        <div className={styles["dot-row"]}>
          <span className={styles["dot-failure"]}></span>
          <Cross />
        </div>
        <div className={styles["dot-row"]}>
          <span className={styles["dot-failure"]}></span>
          <Cross />
        </div>
        <div className={styles["dot-row"]}>
          <span className={styles["dot-failure"]}></span>
          <Cross />
        </div>
        <div className={styles["dot-row"]}>
          <span className={styles["dot-failure"]}></span>
          <Cross />
        </div>
        <div className={styles["dot-row"]}>
          <span className={styles["dot-failure"]}></span>
          <Cross />
        </div>
        <div className={styles["dot-row"]}>
          <span className={styles["dot-failure"]}></span>
          <Cross />
        </div>
      </div>

      <div className={styles["title"]}>Transaction</div>
      <div className={styles["title-failure"]}>Failed!</div>
      <div className={styles["sub-text-failure"]}>
        Something went wrong, Please try again.
      </div>

      {/* <button className="btn add-task-btn">Retry</button> */}
    </div>
  );
}
