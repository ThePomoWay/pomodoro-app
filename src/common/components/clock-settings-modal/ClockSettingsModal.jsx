import { Slider } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserPreferences } from "../../state/selectors";
import { updateUserPref } from "../../state/thunks/GlobalThunk";
import { MiniClock } from "../../svgs/MiniClock";
import { CustomSlider } from "../custom-slider/CustomSlider";
import {
  pomoBreakMarks,
  pomoLongBreakMarks,
  pomoMarks,
} from "./ClockSettingsConstants";
import styles from "./ClockSettingsModal.module.scss";

const sliderSx = {
  "& .MuiSlider-track": {
    color: "#B8C3FE",
  },
  "& .MuiSlider-thumb": {
    color: "#9FAEF8",
  },
  "& .MuiSlider-rail": {
    color: "#E0E5FF",
  },
};

export function ClockSettingsModal(props) {
  let defaultSettings = useSelector(selectUserPreferences);

  let [workTime, setWorkTime] = useState(defaultSettings.defaultWorkTime / 60);
  let [breakTime, setBreakTime] = useState(
    defaultSettings.defaultBreakTime / 60
  );
  let [longBreakTime, setLongBreakTime] = useState(
    defaultSettings.defaultLongBreakTime / 60
  );
  let [autoBreak, setAutoBreak] = useState(defaultSettings.autoplayBreak);
  let [autoPlay, setAutoPlay] = useState(defaultSettings.autoplayPomo);

  useEffect(() => {
    setWorkTime(defaultSettings.defaultWorkTime / 60);
    setBreakTime(defaultSettings.defaultBreakTime / 60);
    setLongBreakTime(defaultSettings.defaultLongBreakTime / 60);
    setAutoPlay(defaultSettings.autoplayPomo);
    setAutoBreak(defaultSettings.autoplayBreak);
  }, [defaultSettings]);

  let dispatch = useDispatch();

  let onSave = () => {
    dispatch(
      updateUserPref({
        defaultWorkTime: workTime * 60,
        defaultBreakTime: breakTime * 60,
        defaultLongBreakTime: longBreakTime * 60,
        autoplayPomo: autoPlay,
        autoplayBreak: autoBreak,
      })
    );
    props.handleClose && props.handleClose();
  };

  return (
    // <Modal
    //   open={props.isModalOpen}
    //   onClose={props.handleClose}
    //   aria-labelledby="clock-settings"
    //   aria-describedby="Change timer length for work time, short and long breaks."
    // >
    <>
      {/* <div className="close" onClick={props.handleClose}>
          <Close />
        </div> */}
      <div className={`font-sub-heading ${styles["heading"]}`}>Pomodoro</div>
      <div className={styles["hr"]}></div>
      <div className={styles["scrollable"]}>
        <div className={styles["settings-text"]}>
          {/* <MiniClock /> */}
          Configure your timer settings here
        </div>
        <div className={styles["slider-item"]}>
          <div className={`font-info ${styles["slider-text"]}`}>
            Default pomodoro time:
          </div>

          <div className={styles["slider"]}>
            <Slider
              aria-label="Work Time"
              value={workTime}
              valueLabelDisplay="off"
              step={5}
              marks={pomoMarks}
              min={25}
              max={45}
              onChange={(_, val) => setWorkTime(val)}
              sx={sliderSx}
            />
          </div>
        </div>
        <div className={styles["slider-item"]}>
          <span className={`font-info ${styles["slider-text"]}`}>
            Default break time:{" "}
          </span>
          <div className={styles["slider"]}>
            <Slider
              aria-label="Break Time"
              value={breakTime}
              valueLabelDisplay="off"
              step={5}
              marks={pomoBreakMarks}
              min={5}
              max={20}
              onChange={(_, val) => setBreakTime(val)}
              sx={sliderSx}
            />
          </div>
        </div>
        <div className={styles["slider-item"]}>
          <span className={`font-info ${styles["slider-text"]}`}>
            Default long break time:{" "}
          </span>
          <div className={styles["slider"]}>
            <Slider
              aria-label="Long Break Time"
              value={longBreakTime}
              valueLabelDisplay="off"
              step={5}
              marks={pomoLongBreakMarks}
              min={15}
              max={30}
              onChange={(_, val) => setLongBreakTime(val)}
              sx={sliderSx}
            />
          </div>
        </div>

        <div className={styles["checkbox"]}>
          <span className="font-info">Enable auto start pomodoro: </span>
          <CustomSlider
            value={autoPlay}
            onChange={() => setAutoPlay(!autoPlay)}
          />
        </div>
        <div className={styles["checkbox"]}>
          <span className="font-info">Enable auto start break: </span>
          <CustomSlider
            value={autoBreak}
            onChange={() => {
              setAutoBreak(!autoBreak);
            }}
          />
        </div>

        <button className="btn btn-save" onClick={onSave}>
          Save Settings
        </button>
      </div>
    </>

    // </Modal>
  );
}
