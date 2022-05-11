import styles from "./CarouselIndicator.module.scss";
export function CarouselIndicator(props) {
  let step = props.step;
  return (
    <div className={styles["carousel"]}>
      {[...Array(3)].map((item, index) => (
        <div
          className={`${styles["item"]} ${
            step === index + 1 && styles["selected"]
          }`}
        ></div>
      ))}
    </div>
  );
}
