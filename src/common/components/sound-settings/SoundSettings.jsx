import { Slider } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MUSIC } from "../../state/reducers/MusicReducer";
import {
  selectDefaultMusic,
  selectUserPreferences,
} from "../../state/selectors";
import { setDefaultMusic } from "../../state/slice/MusicSlice";
import { updateUserPref } from "../../state/thunks/GlobalThunk";
import styles from "./SoundSettings.module.scss";

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
export function SoundSettings(props) {
  let selectedMusic = useSelector(selectDefaultMusic);

  let defaultSettings = useSelector(selectUserPreferences);

  let dispatch = useDispatch();
  let changeDefaultMusic = (music) => {
    dispatch(setDefaultMusic(music));
  };

  let [volume, setVolume] = useState(
    defaultSettings.volume === undefined ? 100 : defaultSettings.volume
  );

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

    onSave(val);

    setVolume(val);
  };
  return (
    <div>
      <div className={`font-sub-heading ${styles["heading"]}`}>Pomodoro</div>
      <div className={styles["hr"]}></div>
      <div className={styles["sound-settings"]}>
        <div
          className={styles["item"]}
          onChange={() => changeDefaultMusic(MUSIC.NONE)}
        >
          <input
            defaultChecked={selectedMusic === MUSIC.NONE}
            className={styles["input"]}
            type="radio"
            name="music"
            id="none"
          />
          <label className={styles["text"]} for="none">
            No Music
          </label>
        </div>
        <div
          className={styles["item"]}
          onChange={() => changeDefaultMusic(MUSIC.TICK)}
        >
          <input
            defaultChecked={selectedMusic === MUSIC.TICK}
            className={styles["input"]}
            type="radio"
            id="tick"
            name="music"
          />
          <label className={styles["text"]} for="tick">
            Tick
          </label>
        </div>
        <div
          className={styles["item"]}
          onChange={() => changeDefaultMusic(MUSIC.LOFI)}
        >
          <input
            defaultChecked={selectedMusic === MUSIC.LOFI}
            className={styles["input"]}
            type="radio"
            name="music"
            id="LoFi"
          />
          <label className={styles["text"]} for="LoFi">
            LoFi
          </label>
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
      </div>
    </div>
  );
}
