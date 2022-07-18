import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../common/components/navbar/Navbar";
import {
  selectDefaultTimes,
  selectTimer,
  selectUserPreferences,
} from "../../common/state/selectors";
import { updateUserPref } from "../../common/state/thunks/GlobalThunk";
import { startTimerAsync } from "../../common/state/thunks/TimerThunk";
import { getTimerString } from "../../common/utils/common";
import { sendWorkerMsg, START_INTERVAL } from "../../common/utils/worker-util";
import styles from "./TempPage.module.scss";
export function TempPage() {
  let defaults = useSelector(selectDefaultTimes);

  let defaultSettings = useSelector(selectUserPreferences);
  let [timerLength, setTimerLength] = useState(defaults.defaultWorkTime / 60);
  let [bgColor, setBgColor] = useState("white");
  let [fontColor, setFontColor] = useState("black");
  let [fontWeight, setFontWeight] = useState(400);
  let [fontSize, setFontSize] = useState(24);

  let timerSec = useSelector(selectTimer);
  let timerString = getTimerString(timerSec);

  let dispatch = useDispatch();
  let doPlay = () => {
    dispatch(startTimerAsync());
    startInterval();
  };

  const startInterval = () => {
    sendWorkerMsg(START_INTERVAL);
  };

  let updatePref = (val) => {
    setTimerLength(val);
    dispatch(
      updateUserPref({
        ...defaultSettings,
        defaultWorkTime: val * 60,
      })
    );
  };

  return (
    <div>
      <Navbar />
      <div className={styles["container"]} style={{ backgroundColor: bgColor }}>
        <div
          className={styles["text"]}
          style={{
            fontSize: fontSize + "px",
            color: fontColor,
            fontWeight: fontWeight,
          }}
        >
          {timerString}
        </div>
      </div>
      <div className={styles["controls"]}>
        <label>font size</label>
        <input
          value={fontSize || ""}
          onChange={(e) => {
            console.log(e);
            setFontSize(e.target.value);
          }}
        />

        <label>Background color</label>
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
        />
        <label>Font color</label>
        <input
          type="color"
          value={fontColor}
          onChange={(e) => setFontColor(e.target.value)}
        />

        <label>Font Weight</label>
        <input
          value={fontWeight}
          onChange={(e) => setFontWeight(e.target.value)}
        />
        <label>Timer Length</label>
        <input
          value={timerLength}
          onChange={(e) => updatePref(e.target.value)}
        />
      </div>

      <button className="btn btn-theme" onClick={() => doPlay()}>
        Play
      </button>
    </div>
  );
}
