import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDefaultTimes,
  selectFocusMode,
  selectPomoState,
  selectTimer,
} from "../../state/selectors";
import {
  pauseTimerAsync,
  resumeTimerAsync,
  tickAsync,
  updateNextState,
  updateTimerState,
} from "../../state/slices/TimerSlice";
import {
  POMO_RUNNING_STATE,
  POMO_IDLE_STATE,
  POMO_PAUSED_STATE,
  POMO_BREAK_IDLE_STATE,
  POMO_LONG_BREAK_IDLE_STATE,
  POMO_BREAK_RUNNING_STATE,
  POMO_LONG_BREAK_RUNNING_STATE,
  POMO_LONG_BREAK_PAUSED_STATE,
  POMO_BREAK_PAUSED_STATE,
} from "../../utils/constants";
import styles from "./timer.module.scss";
import {
  Pause,
  PlayArrow,
  PlayArrowOutlined,
  Replay,
  Replay10Outlined,
  ReplayOutlined,
  SkipNext,
  Stop,
} from "@material-ui/icons";
import { getTimerString } from "../../utils/common";
import {
  focusModeToggle,
  hideFirstUserScreen,
} from "../../state/slices/GlobalSlice";
import {
  getTab,
  TAB_BREAK,
  TAB_LONG_BREAK,
  TAB_POMODORO,
  actionStateMap,
} from "./timer-utils";
import { PlaySvg } from "../../svgs/Play";
import { PauseSvg } from "../../svgs/PauseSvg";
import { RewindSvg } from "../../svgs/Rewind";

let timer = 0;

const ACTION_PLAY = "play";
const ACTION_PAUSE = "pause";
const ACTION_SKIP = "skip";
const ACTION_STOP = "stop";

const TIMER_BG_COLOR = {
  [TAB_POMODORO]: "#344493",
  [TAB_BREAK]: "#344493",
  [TAB_LONG_BREAK]: "#344493",
};

let getNextPomoState = function (curState, action) {
  return actionStateMap[getTab(curState)][action];
};

let getTotalTime = function (defaults, tab) {
  if (tab === TAB_POMODORO) {
    return defaults.defaultWorkTime;
  }
  if (tab === TAB_BREAK) {
    return defaults.defaultBreakTime;
  }
  return defaults.defaultLongBreakTime;
};
export default function Timer() {
  let timerSec = useSelector(selectTimer);
  let timerString = getTimerString(timerSec);
  let defaults = useSelector(selectDefaultTimes);

  let focusModeState = useSelector(selectFocusMode);

  let timerSecRef = useRef(null);
  let timerElRef = useRef(null);

  useEffect(() => {
    timerSecRef.current = timerSec;
  });

  let state = useSelector(selectPomoState);
  let dispatch = useDispatch();

  const startInterval = () => {
    if (!timer) {
      timer = setInterval(() => {
        if (timerSecRef.current > 0) {
          dispatch(tickAsync());
          console.log(timerSecRef.current);
        }
      }, 1000);
    }
  };

  const doStartTimer = useCallback((isCta) => {
    if (!timer) {
      if (isCta) {
        dispatch(
          updateTimerState({
            pomoStartTime: Date.now(),
            pomoState: getNextPomoState(state, ACTION_PLAY),
          })
        );
      } else {
        dispatch(
          updateTimerState({
            pomoState: getNextPomoState(state, ACTION_PLAY),
          })
        );
      }

      startInterval();
      dispatch(hideFirstUserScreen());
    }
  });

  const doPauseTimer = useCallback(() => {
    if (timer) {
      clearInterval(timer);
      timer = 0;
    }
    dispatch(pauseTimerAsync());
    // dispatch(updateTimerState({
    //     pomoState: getNextPomoState(state, ACTION_PAUSE),
    // }));
  });

  const doResumeTimer = useCallback(() => {
    dispatch(resumeTimerAsync());
    setTimeout(startInterval, 0);
  });

  const doStopTimer = useCallback(() => {
    if (timer) {
      clearInterval(timer);
      timer = 0;
    }
    dispatch(
      updateTimerState({
        pomoState: getNextPomoState(state, ACTION_STOP),
        timerInSec: defaults.defaultWorkTime,
        ptime: "",
        psec: 0,
      })
    );
  });

  const doSkipBreak = useCallback(() => {
    if (timer) {
      clearInterval(timer);
      timer = 0;
    }
    dispatch(updateNextState());
  });
  const getCTA = useCallback(
    (state) => {
      if (state === POMO_IDLE_STATE) {
        return (
          <div
            className={`${styles["timer-cta"]} grid grid-center`}
            onClick={(e) => doStartTimer(true)}
          >
            <PlaySvg />
          </div>
        );
      }

      if (state === POMO_RUNNING_STATE) {
        return (
          <div className={`${styles["timer-cta"]} grid ${styles["cta-2"]}`}>
            <span onClick={doPauseTimer}>
              {" "}
              <PauseSvg />{" "}
            </span>
            <span onClick={doStopTimer}>
              {" "}
              <RewindSvg />{" "}
            </span>
          </div>
        );
      }

      if (state === POMO_PAUSED_STATE) {
        return (
          <div className={`${styles["timer-cta"]} grid ${styles["cta-2"]}`}>
            <span onClick={(e) => doResumeTimer()}>
              {" "}
              <PlaySvg />
            </span>
            <span onClick={doStopTimer}>
              <RewindSvg />
            </span>
          </div>
        );
      }

      if (
        state === POMO_BREAK_IDLE_STATE ||
        state === POMO_LONG_BREAK_IDLE_STATE
      ) {
        return (
          <div className={`${styles["timer-cta"]} grid ${styles["cta-2"]}`}>
            <span onClick={(e) => doStartTimer(true)}>
              {" "}
              <PlaySvg />
            </span>
            <span onClick={doSkipBreak}>
              <SkipNext />{" "}
            </span>
          </div>
        );
      }
      if (
        state === POMO_BREAK_RUNNING_STATE ||
        state === POMO_LONG_BREAK_RUNNING_STATE
      ) {
        return (
          <div className={`${styles["timer-cta"]} grid ${styles["cta-2"]}`}>
            <span onClick={doPauseTimer}>
              {" "}
              <PauseSvg />
            </span>
            <span onClick={doSkipBreak}>
              <SkipNext />{" "}
            </span>
          </div>
        );
      }

      if (
        state === POMO_LONG_BREAK_PAUSED_STATE ||
        state === POMO_BREAK_PAUSED_STATE
      ) {
        return (
          <div className={`${styles["timer-cta"]} grid ${styles["cta-2"]}`}>
            <span onClick={(e) => doStartTimer(false)}>
              {" "}
              <PlaySvg />
            </span>
            <span onClick={doSkipBreak}>
              {" "}
              <SkipNext />
            </span>
          </div>
        );
      }
    },
    [state]
  );

  useEffect(() => {
    // if(timerSec <= 0) {
    //     clearInterval(timer)
    //     timer = 0;
    //     dispatch(updateNextState());
    // }

    if (state === POMO_RUNNING_STATE && !timer && timerSec > 0) {
      doStartTimer(false);
    }

    if (state === POMO_PAUSED_STATE && timer) {
      doPauseTimer();
    }

    if (
      (state === POMO_BREAK_IDLE_STATE ||
        state === POMO_IDLE_STATE ||
        state === POMO_LONG_BREAK_IDLE_STATE) &&
      timer
    ) {
      clearInterval(timer);
      timer = 0;
    }
  }, [timerSec, state]);

  let tab = getTab(state);

  let changePomoState = useCallback((nextState) => {
    let tab = getTab(nextState);
    let nextTimerInSecs = defaults.defaultWorkTime;
    if (tab === TAB_BREAK) {
      nextTimerInSecs = defaults.defaultBreakTime;
    } else if (tab === TAB_LONG_BREAK) {
      nextTimerInSecs = defaults.defaultLongBreakTime;
    }
    dispatch(
      updateTimerState({
        pomoState: nextState,
        timerInSec: nextTimerInSecs,
      })
    );
  });

  let percentComplete = (timerSec / getTotalTime(defaults, tab)) * 100;

  let timerStyle = {
    background:
      "linear-gradient(0deg, " +
      TIMER_BG_COLOR[tab] +
      " 0%, #5468ce " +
      percentComplete +
      "%, white " +
      (percentComplete + 1) +
      "%, #C3C3C3 100%)",
  };

  const onFocusModeSwitch = useCallback((e) => {
    dispatch(focusModeToggle(!focusModeState));
  });

  let radiusTime = getTotalTime(defaults, tab) / 2;

  let timerWidth = (timerElRef.current && timerElRef.current.offsetWidth) || 0;

  let secretParameter = timerWidth / getTotalTime(defaults, tab);

  let t =
    percentComplete <= 50
      ? secretParameter *
        2 *
        Math.sqrt(getTotalTime(defaults, tab) * timerSec - timerSec * timerSec)
      : secretParameter *
        2 *
        Math.sqrt(radiusTime * radiusTime - Math.pow(timerSec - radiusTime, 2));

  let height =
    percentComplete >= 50 ? ((100 - percentComplete) / 50) * 15 + 20 : 30;

  let transform = "translateY(-" + height / 2 + "px) translateX(-50%)";

  return (
    <div className={`${styles.timer}`}>
      <div className={styles["timer-tabs"]}>
        <div
          className={`${styles["timer-tabs-item"]} ${
            tab === "pomodoro" && styles["selected-purple"]
          }`}
          onClick={() => {
            changePomoState(POMO_IDLE_STATE);
          }}
        >
          Work Mode
        </div>
        <div
          className={`${styles["timer-tabs-item"]} ${
            tab === "break" && styles["selected-pink"]
          }`}
          onClick={() => {
            changePomoState(POMO_BREAK_IDLE_STATE);
          }}
        >
          Short Break
        </div>
        <div
          className={`${styles["timer-tabs-item"]} ${
            tab === "long_break" && styles["selected-cyan"]
          }`}
          onClick={() => {
            changePomoState(POMO_LONG_BREAK_IDLE_STATE);
          }}
        >
          Long Break
        </div>
      </div>
      <div className={`${styles.round} ${styles[tab]} grid grid-center`}>
        <span className={styles["timer-text"]}> {timerString}</span>
        <div className={styles["box"]} ref={timerElRef}>
          {/* <div className={styles["percent"]}>
                            <div className={styles["percentNum"]} id="count">0</div>
                            <div class="percentB">%</div>
                        </div> */}
          <div
            id="water"
            className={styles["water"]}
            style={{
              transform: "translate(0" + "," + (100 - percentComplete) + "%)",
            }}
          >
            <div
              className={styles["timer-circle"]}
              style={{
                width: t,
                height: height + "px",
                transform,
              }}
            ></div>
            {/* <svg
              viewBox="0 0 560 20"
              className={`${styles["water_wave"]} ${styles["water_wave_back"]}`}
            >
              <use href="#wave"></use>
            </svg>
            <svg
              viewBox="0 0 560 20"
              className={`${styles["water_wave"]} ${styles["water_wave_front_2"]}`}
            >
              <use href="#wave"></use>
            </svg>
            <svg
              viewBox="0 0 560 20"
              className={`${styles["water_wave"]} ${styles["water_wave_front"]}`}
            >
              <use href="#wave"></use>
            </svg> */}
          </div>
        </div>

        {/* <div id="water" style={{transform: 'translate(0'+','+(percentComplete)+'%)'}} className={styles["water"]}>
                        <svg viewBox="0 0 560 20" class="water_wave water_wave_back">
                        <use href="#wave"></use>
                        </svg>
                        <svg viewBox="0 0 560 20" class="water_wave water_wave_front">
                        <use href="#wave"></use>
                        </svg>
                    </div> */}
        {getCTA(state)}
      </div>
      <div className={`${styles["blur-bg"]} ${styles[tab]}`}>
        <div className={styles["blur"]}></div>
      </div>

      {/* <div className={styles["focus-mode"]}>
        <span>Focus Mode</span>
        <label className="switch">
          <input
            type="checkbox"
            onChange={(e) => {
              onFocusModeSwitch();
            }}
            defaultChecked={focusModeState}
          />
          <span className="slider round"></span>
        </label>
      </div> */}

      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        style={{ display: "none" }}
      >
        <symbol id="wave">
          <path d="M420,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C514,6.5,518,4.7,528.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H420z"></path>
          <path d="M420,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C326,6.5,322,4.7,311.5,2.7C304.3,1.4,293.6-0.1,280,0c0,0,0,0,0,0v20H420z"></path>
          <path d="M140,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C234,6.5,238,4.7,248.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H140z"></path>
          <path d="M140,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C46,6.5,42,4.7,31.5,2.7C24.3,1.4,13.6-0.1,0,0c0,0,0,0,0,0l0,20H140z"></path>
        </symbol>
      </svg>
    </div>
  );
}
