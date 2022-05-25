import styles from "./TimerUI.module.scss";
export function TimerUI(props) {
  return (
    <div className={styles["timer"]}>
      <div className={styles["text"]}>??</div>
      <div className={styles["cta"]}></div>
    </div>
  );
}
