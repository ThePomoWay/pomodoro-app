import styles from "./FeatureCard.module.scss";

export function FeatureCard(props) {
  return (
    <div className={styles["feature-card"]}>
      <div className={styles["circle"]}>{props.svg}</div>
      <div className={styles["text"]}>{props.text}</div>
      <div className={styles["sub-text"]}>{props.desc}</div>
    </div>
  );
}
