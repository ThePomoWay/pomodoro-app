import styles from "./CustomSlider.module.scss";

export function CustomSlider(props) {
  console.log(props.value);
  return (
    <label className={`${styles["switch"]}`}>
      <input
        type="checkbox"
        checked={props.value}
        onChange={(e) => {
          props.onChange && props.onChange(e);
        }}
        defaultChecked={props.defaultChecked}
      />
      <span className={styles["slider"] + " " + styles["round"]}></span>
    </label>
  );
}
