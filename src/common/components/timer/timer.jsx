import { SkipNext } from "@material-ui/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import AuthService from "../../API/network/AuthService";
import {
  selectCompletedPomos,
  selectDefaultTimes,
  selectFocusMode,
  selectPomoState,
  selectTimer,
} from "../../state/selectors";
import { setIsExtensionModalOpen } from "../../state/slice/GlobalSlice";
import {
  focusModeToggle,
  hideFirstUserScreen,
} from "../../state/thunks/GlobalThunk";
import {
  pauseTimerAsync,
  resetTimerAsync,
  resumeTimerAsync,
  startTimerAsync,
  tickAsync,
  updateNextState,
  updateTimerState,
} from "../../state/thunks/TimerThunk";
import { PauseSvg } from "../../svgs/PauseSvg";
import { PlaySvg } from "../../svgs/Play";
import { RewindSvg } from "../../svgs/Rewind";
import { getTimerString } from "../../utils/common";
import {
  POMO_BREAK_IDLE_STATE,
  POMO_BREAK_PAUSED_STATE,
  POMO_BREAK_RUNNING_STATE,
  POMO_IDLE_STATE,
  POMO_LONG_BREAK_IDLE_STATE,
  POMO_LONG_BREAK_PAUSED_STATE,
  POMO_LONG_BREAK_RUNNING_STATE,
  POMO_PAUSED_STATE,
  POMO_RUNNING_STATE,
} from "../../utils/constants";
import { getTimeText } from "../../utils/date-utils";
import { isExtensionPresent } from "../../utils/extension-utils";
import {
  CLEAR_INTERVAL,
  sendWorkerMsg,
  START_INTERVAL,
} from "../../utils/worker-util";
import { Alert } from "../alert/Alert";
import { CustomSlider } from "../custom-slider/CustomSlider";
import { getTab, TAB_BREAK, TAB_LONG_BREAK, TAB_POMODORO } from "./timer-utils";
import styles from "./timer.module.scss";

const ALERT_TITLE = "Are you sure you want to skip the current session?";
const ALERT_DESCRIPTION =
  "This action will reset the current timer. Progress on pomodoro won't be recorded";

const TIMER_BG_COLOR = {
  [TAB_POMODORO]: "#344493",
  [TAB_BREAK]: "#344493",
  [TAB_LONG_BREAK]: "#344493",
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

let initialized = false;
export default function Timer(props) {
  let timerSec = useSelector(selectTimer);
  let timerString = getTimerString(timerSec);
  let defaults = useSelector(selectDefaultTimes);
  let cPomos = useSelector(selectCompletedPomos);

  let focusModeState = useSelector(selectFocusMode);

  let timerElRef = useRef(null);

  let state = useSelector(selectPomoState);
  let dispatch = useDispatch();

  let [showAlertModal, setShowAlertModal] = useState(false);

  const startInterval = () => {
    sendWorkerMsg(START_INTERVAL);
  };

  //Remove interval on component unmount
  // useEffect(() => {
  //   return () => {
  //     sendWorkerMsg(CLEAR_INTERVAL);
  //   };
  // }, []);

  const doStartTimer = () => {
    dispatch(startTimerAsync());

    startInterval();
    dispatch(hideFirstUserScreen());

    props.onTimerStart && props.onTimerStart();
  };

  const doPauseTimer = () => {
    sendWorkerMsg(CLEAR_INTERVAL);

    props.onPause && props.onPause();
    dispatch(pauseTimerAsync());
    // dispatch(updateTimerState({
    //     pomoState: getNextPomoState(state, ACTION_PAUSE),
    // }));
  };

  const doResumeTimer = () => {
    dispatch(resumeTimerAsync());
    // setTimeout(startInterval, 0);
    startInterval();

    props.onTimerStart && props.onTimerStart();
  };

  const doStopTimer = useCallback(() => {
    sendWorkerMsg(CLEAR_INTERVAL);

    props.onReset && props.onReset();
    dispatch(resetTimerAsync());
  });

  const doSkipBreak = useCallback(() => {
    sendWorkerMsg(CLEAR_INTERVAL);

    dispatch(updateNextState({ disableAlarm: true }));
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
            <span onClick={() => setShowAlertModal("stop")}>
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
            <span onClick={() => setShowAlertModal("stop")}>
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
            <span onClick={(e) => doResumeTimer(false)}>
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

    if (
      (state === POMO_RUNNING_STATE ||
        state === POMO_BREAK_RUNNING_STATE ||
        state === POMO_LONG_BREAK_RUNNING_STATE) &&
      timerSec > 0
    ) {
      startInterval();

      if (!initialized) {
        props.onTimerStart && props.onTimerStart();
      }
    }

    // if (state === POMO_PAUSED_STATE) {
    //   doPauseTimer();
    // }

    if (
      state === POMO_BREAK_IDLE_STATE ||
      state === POMO_IDLE_STATE ||
      state === POMO_LONG_BREAK_IDLE_STATE
    ) {
      sendWorkerMsg(CLEAR_INTERVAL);
    }

    if (timerSec <= 0) {
      dispatch(tickAsync());
    }
    initialized = true;
  }, [state]);

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

  const isMobileDevice = useMediaQuery({
    query: "(max-device-width: 899px)",
  });

  const onFocusModeSwitch = (e) => {
    if (isExtensionPresent) {
      dispatch(focusModeToggle(!focusModeState));
    } else {
      dispatch(setIsExtensionModalOpen(true));
    }
  };

  let onTabChange = (nextState) => {
    if (state === POMO_RUNNING_STATE) {
      setShowAlertModal(nextState);
    } else {
      changePomoState(nextState);
    }
  };
  let onTabChangeSuccess = (nextState) => {
    if (nextState === "stop") {
      doStopTimer();
    } else {
      changePomoState(nextState);
    }
    setShowAlertModal("");
  };

  let scrollPage = () => {
    window.scroll(0, window.innerHeight);
  };

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
    <>
      <Alert
        onClose={(e) => setShowAlertModal(false)}
        showModal={showAlertModal}
        onSuccess={() => onTabChangeSuccess(showAlertModal)}
        cta={"Continue"}
        title={ALERT_TITLE}
        description={ALERT_DESCRIPTION}
      ></Alert>
      <div className={`${styles.timer}`}>
        <div className={styles["timer-tabs"]}>
          <div
            className={`${styles["timer-tabs-item"]} ${
              tab === "pomodoro" && styles["selected-purple"]
            }`}
            onClick={() => {
              onTabChange(POMO_IDLE_STATE);
            }}
          >
            Work Mode
          </div>
          <div
            className={`${styles["timer-tabs-item"]} ${
              tab === "break" && styles["selected-pink"]
            }`}
            onClick={() => {
              onTabChange(POMO_BREAK_IDLE_STATE);
            }}
          >
            Short Break
          </div>
          <div
            className={`${styles["timer-tabs-item"]} ${
              tab === "long_break" && styles["selected-cyan"]
            }`}
            onClick={() => {
              onTabChange(POMO_LONG_BREAK_IDLE_STATE);
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
        {/* {!props.hideBlur && (
          <div className={`${styles["blur-bg"]} ${styles[tab]}`}>
            <div className={styles["blur"]}></div>
          </div>
        )} */}

        {tab === "pomodoro" && !isMobileDevice && (
          <div className={styles["focus-mode"]}>
            <span>Focus Mode</span>
            <CustomSlider
              value={focusModeState}
              defaultChecked={focusModeState}
              onChange={(e) => {
                onFocusModeSwitch();
              }}
            />
          </div>
        )}

        {isMobileDevice && (
          <div className={styles["mobile-stats"]}>
            <span className={styles["first"]}>Pomos: {cPomos}</span>
            <span className={styles["second"]}>
              Time: {getTimeText((cPomos * defaults.defaultWorkTime) / 60)}
            </span>
          </div>
        )}

        {isMobileDevice && !AuthService.isLoggedIn() && (
          <div className={styles["know-more"]} onClick={scrollPage}>
            Know More
          </div>
        )}

        {/* // <label className="switch">
          //   <input
          //     type="checkbox"
          //     onChange={(e) => {
          //       onFocusModeSwitch();
          //     }}
          //     defaultChecked={focusModeState}
          //   />
          //   <span className="slider round"></span>
          // </label> */}
        {/* </div> */}

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
    </>
  );
}
