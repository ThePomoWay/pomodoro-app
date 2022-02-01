import { Checkbox, Slider } from "@mui/material";
import { useCallback } from "react";
import { CustomSlider } from "../custom-slider/CustomSlider";

import styles from "./ClockSettings.module.scss";
import {
  pomoBreakMarks,
  pomoLongBreakMarks,
  pomoMarks,
} from "./ClockSettingsConstants";

export function ClockSettings(props) {
  let isAutoBreakEnabled = true;

  const enableAutoBreak = useCallback(() => {});

  return (
    <div>
      <div className={`font-heading ${styles["heading"]}`}>
        Configure your timer settings here:
      </div>
      <div className={styles["slider-item"]}>
        <div className={`font-sub-heading ${styles["slider-text"]}`}>
          Default pomodoro time:
        </div>

        <div className={styles["slider"]}>
          <Slider
            aria-label="Temperature"
            defaultValue={25}
            valueLabelDisplay="off"
            step={5}
            marks={pomoMarks}
            min={25}
            max={45}
          />
        </div>
      </div>
      <div className={styles["slider-item"]}>
        <span className={`font-sub-heading ${styles["slider-text"]}`}>
          Default break time:{" "}
        </span>
        <div className={styles["slider"]}>
          <Slider
            aria-label="Temperature"
            defaultValue={5}
            valueLabelDisplay="off"
            step={5}
            marks={pomoBreakMarks}
            min={5}
            max={20}
          />
        </div>
      </div>
      <div className={styles["slider-item"]}>
        <span className={`font-sub-heading ${styles["slider-text"]}`}>
          Default long break time:{" "}
        </span>
        <div className={styles["slider"]}>
          <Slider
            aria-label="Temperature"
            defaultValue={15}
            valueLabelDisplay="off"
            step={5}
            marks={pomoLongBreakMarks}
            min={15}
            max={30}
          />
        </div>
      </div>

      <div className={styles["checkbox"]}>
        <span className="font-sub-heading">Enable auto start break: </span>
        <CustomSlider />
      </div>

      <div className={styles["checkbox"]}>
        <span className="font-sub-heading">Enable auto start pomodoro: </span>
        <CustomSlider />
      </div>
    </div>
  );
}
