import styles from "./CustomSlider.module.scss";

export function CustomSlider(props) {
  return (
    <label className={`${styles["switch"]}`}>
      <input
        type="checkbox"
        checked={props.value || false}
        onChange={(e) => {
          props.onChange && props.onChange(e);
        }}
      />
      <span className={styles["slider"] + " " + styles["round"]}>
        <span className={styles["circle"]}></span>
      </span>
    </label>
  );
}
