import { ArrowLeftOutlined, ArrowRightOutlined } from "@material-ui/icons";
import { useState } from "react";
import styles from "./SliderDatePicker.module.scss";

export function SliderDatePicker(props) {
  let [sliderVal, setSliderVal] = useState(props.max);

  let sliderClick = (action) => {
    if (action === "increment") {
      if (sliderVal < props.max) {
        setSliderVal(sliderVal + 1);
        props.onChange && props.onChange(action, sliderVal + 1);
      }
    } else {
      setSliderVal(sliderVal - 1);
      props.onChange && props.onChange(action, sliderVal - 1);
    }
  };
  return (
    <div className={styles["container"]}>
      <span
        className={styles["icon"]}
        onClick={(e) => sliderClick("decrement")}
      >
        <ArrowLeftOutlined />
      </span>
      <span className={styles["title"]}>{props.title || "title"}</span>
      <span
        className={`${styles["icon"]} ${
          sliderVal === props.max && styles["max"]
        }`}
        onClick={(e) => sliderClick("increment")}
      >
        <ArrowRightOutlined />
      </span>
    </div>
  );
}
