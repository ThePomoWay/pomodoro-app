import styles from "./ProgressStrip.module.scss";
export function ProgressStrip(props) {
  return (
    <div className={styles["progress"]}>
      {[...Array(3)].map((_, index) => (
        <div
          key={"progressStrip" + index}
          onClick={() => props.onChange && props.onChange(index)}
          className={`${styles["strip"]} ${
            props.selected > index - 1 ? styles["selected"] : ""
          }`}
        ></div>
      ))}
    </div>
  );
}
