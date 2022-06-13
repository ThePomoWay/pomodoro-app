import Navbar from "../navbar/Navbar";
import { TimerUI } from "../timer-ui/TimerUI";
import styles from "./NotFound.module.scss";

export function NotFound() {
  return (
    <>
      <Navbar />
      <div className={styles["container"]}>
        <div className={styles["fluid"]}>
          <div className={styles["first"]}>
            <p className={styles["title"]}>Hmm.</p>
            <p className={styles["subtitle"]}>
              We couldn't find the page you were looking for. Start training
              your time again!
            </p>
            <div className={styles["ctas"]}>
              <button
                className="btn add-task-btn"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Home
              </button>
            </div>
          </div>
          <TimerUI />
        </div>
      </div>
    </>
  );
}
