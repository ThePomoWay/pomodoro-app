import Navbar from "../navbar/Navbar";
import styles from "./NotFound.module.scss";

export function NotFound() {
  return (
    <>
      <Navbar />
      <div className={styles["container"]}>
        <div className={styles["fluid"]}>
          <div>
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
        </div>
      </div>
    </>
  );
}
