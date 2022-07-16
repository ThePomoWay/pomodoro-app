import { Slider } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserPreferences } from "../../state/selectors";
import { updateUserPref } from "../../state/thunks/GlobalThunk";
import { CustomSlider } from "../custom-slider/CustomSlider";
import { debounce } from "../timer/timer-utils";
import {
  pomoBreakMarks,
  pomoLongBreakMarks,
  pomoMarks,
  volumeMarks,
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

let playing = false;

export function ClockSettings(props) {
  let defaultSettings = useSelector(selectUserPreferences);

  let [workTime, setWorkTime] = useState(defaultSettings.defaultWorkTime / 60);
  let [breakTime, setBreakTime] = useState(
    defaultSettings.defaultBreakTime / 60
  );
  let [longBreakTime, setLongBreakTime] = useState(
    defaultSettings.defaultLongBreakTime / 60
  );

  let [volume, setVolume] = useState(
    defaultSettings.volume === undefined ? 100 : defaultSettings.volume
  );
  let [autoBreak, setAutoBreak] = useState(defaultSettings.autoplayBreak);
  let [autoPlay, setAutoPlay] = useState(defaultSettings.autoplayPomo);

  // useEffect(() => {
  //   setWorkTime(defaultSettings.defaultWorkTime / 60);
  //   setBreakTime(defaultSettings.defaultBreakTime / 60);
  //   setLongBreakTime(defaultSettings.defaultLongBreakTime / 60);
  //   setAutoPlay(defaultSettings.autoplayPomo);
  //   setAutoBreak(defaultSettings.autoplayBreak);
  //   setVolume(
  //     defaultSettings.volume === undefined ? 100 : defaultSettings.volume
  //   );
  // }, [defaultSettings]);

  let dispatch = useDispatch();

  let onSave = (obj) => {
    dispatch(
      updateUserPref({
        ...defaultSettings,
        ...obj,
      })
    );

    // props.handleClose && props.handleClose();
  };

  let onChangeVolume = (val) => {
    let audio = new Audio("/sounds/tick.mp3");
    audio.volume = val / 100;
    audio.loop = false;

    if (!playing) {
      playing = true;

      audio.play();
      setTimeout(() => {
        audio.pause();
        playing = false;
      }, 1000);
    }

    onSave();

    setVolume(val);
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
      {!props.hideSidebar && (
        <>
          <div className={`font-sub-heading ${styles["heading"]}`}>
            Pomodoro
          </div>
          <div className={styles["hr"]}></div>
        </>
      )}

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
              onChange={(_, val) => {
                setWorkTime(val);
                onSave({
                  defaultWorkTime: val * 60,
                });
              }}
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
              onChange={(_, val) => {
                setBreakTime(val);
                onSave({
                  defaultBreakTime: val * 60,
                });
              }}
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
              onChange={(_, val) => {
                setLongBreakTime(val);
                onSave({
                  defaultLongBreakTime: val * 60,
                });
              }}
              sx={sliderSx}
            />
          </div>
        </div>

        <div className={styles["slider-item"]}>
          <span className={`font-info ${styles["slider-text"]}`}>
            Sound Volume
          </span>
          <div className={styles["slider"]}>
            <Slider
              aria-label="Long Break Time"
              value={volume}
              valueLabelDisplay="off"
              step={10}
              min={0}
              max={100}
              onChange={(_, val) => {
                onChangeVolume(val);
                onSave({
                  volume: val,
                });
              }}
              sx={sliderSx}
            />
          </div>
        </div>

        <div className={styles["checkbox"]}>
          <span className="font-info">Enable auto start pomodoro: </span>
          <CustomSlider
            value={autoPlay}
            onChange={() => {
              setAutoPlay(!autoPlay);
              onSave({
                autoplayPomo: !autoPlay,
              });
            }}
          />
        </div>
        <div className={styles["checkbox"]}>
          <span className="font-info">Enable auto start break: </span>
          <CustomSlider
            value={autoBreak}
            onChange={() => {
              setAutoBreak(!autoBreak);
              onSave({
                autoplayBreak: !autoBreak,
              });
            }}
          />
        </div>

        {/* <button className="btn btn-save" onClick={onSave}>
          Save Settings
        </button> */}
      </div>
    </>

    // </Modal>
  );
}
