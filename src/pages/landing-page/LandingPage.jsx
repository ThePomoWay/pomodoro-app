import NavbarNew from "../../common/components/navbar-new/NavbarNew";
import styles from "./LandingPage.module.scss";

export function LandingPage(props) {
  return (
    <div>
      <NavbarNew />
      <div className={styles["first-container"]}>
        <div className={styles["left"]}>
          <p className={styles["title"]}>
            <p>Productive &</p>
            <p>Distraction Free </p>
            <p>Work Sessions</p>
          </p>

          <p className={styles["sub-title"]}>
            Are your deadlines overwhelming you? Timedojo gives you the right
            push to get started on your daily tasks list for the day. We use the
            proven Pomodoro technique to improve work quality & time management.
          </p>

          <div className={styles["ctas"]}>
            <button className="btn btn-add-new">Get Started</button>
            <p className={styles["add-more"]}>Know More</p>
          </div>
        </div>
        <div className={styles["right"]}>
          <div className={styles["main-circle"]}>
            <div className={styles["circle-2"]}></div>
            <div className={styles["purple-rect"]}></div>
            <span className={styles["tp-circle-1"]}>
              <span className={styles["rect"]}></span>
            </span>

            <span className={styles["tp-circle-2"]}>
              <span className={styles["rect"]}></span>
            </span>

            <span className={styles["tp-circle-3"]}></span>
          </div>
        </div>
      </div>
      <div className={styles["container"]}></div>
    </div>
  );
}
