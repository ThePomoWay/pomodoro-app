import styles from "./TimerUI.module.scss";
export function TimerUI(props) {
  return (
    <div className={styles["timer"]}>
      <div className={styles["text"]}>25:00</div>
      <div className={styles["cta"]}></div>
    </div>
  );
}
