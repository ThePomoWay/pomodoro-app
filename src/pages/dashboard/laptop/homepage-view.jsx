import { SettingsApplicationsOutlined } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCompletedPomos } from "../../../common/state/selectors";
import CurrentTask from "../../../common/components/current-task/currentTask";
import Navbar from "../../../common/components/navbar/Navbar";
import { TodaysTaskContainer } from "../../../common/components/tasklist/TodaysTaskContainer";
import Timer from "../../../common/components/timer/timer";
import {
  getTab,
  TAB_POMODORO,
} from "../../../common/components/timer/timer-utils";
import {
  setIsTimerFullScreen,
  setSettingsModal,
  showClockSettingsModal,
} from "../../../common/state/slice/GlobalSlice";
import { markTaskAsCompleteThunk } from "../../../common/state/thunks/TasksThunk";
import { pauseTimerAsync } from "../../../common/state/thunks/TimerThunk";
import { MaximizeIcon } from "../../../common/svgs/MaximizeIcon";
import { ShrinkIcon } from "../../../common/svgs/ShrinkIcon";
import { scrollToEndOfContainer } from "../../../common/utils/common";
import OnBoarding from "../../onboarding/Onboarding";
import Settings from "../../settings/Settings";
import useHomepage from "../HomePage-hook";
import styles from "./homepage-laptop.module.scss";

import { ReactComponent as SettingsIcon } from "../../../common/svgs/SettingsIcon.svg";
import ClockSettingsModal from "../../../common/components/clock-settings-modal/ClockSettingsModal";
import AuthService from "../../../common/API/network/AuthService";

import { useNavigate } from "react-router-dom";
import { MusicPlayer } from "../../../common/components/music-player/MusicPlayer";
import { HideOnFullScreen } from "../../../common/components/hide-on-full-screen/HideOnFullScreen";
import { useHideOnFullScreen } from "../../../common/components/hide-on-full-screen/useHideOnFullScreen";
import { BreathingExercise } from "../../../common/components/breathing-exercise/BreathingExercise";
import { KeyboardShortcutOverlay } from "../../../common/components/keyboard-shortcut-overlay/KeyboardShortcutOverlay";
import { SessionCompleteModal } from "../../../common/components/session-complete/SessionCompleteModal";
import {
  POMO_BREAK_RUNNING_STATE,
  POMO_LONG_BREAK_RUNNING_STATE,
} from "../../../common/utils/constants";
import kbdStyles from "../../../common/components/keyboard-shortcut-overlay/KeyboardShortcutOverlay.module.scss";

export function HomepageLaptop() {
  let {
    showSidebar,
    timerBgColor,
    isTimerFullScreen,
    toggleFullScreen,
    pomoState,
  } = useHomepage();

  let dispatch = useDispatch();
  let containerRef = useRef();

  const completedPomos = useSelector(selectCompletedPomos);
  const prevCompletedPomosRef = useRef(completedPomos);

  const [showBreathing, setShowBreathing] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSessionComplete, setShowSessionComplete] = useState(false);
  const prevPomoStateRef = useRef(pomoState);

  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        document.activeElement?.isContentEditable;
      if (isTyping) return;
      if (e.key === "?") setShowShortcuts((v) => !v);
      if (e.key === "Escape") setShowShortcuts(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const prev = prevPomoStateRef.current;
    const isBreakNow =
      pomoState === POMO_BREAK_RUNNING_STATE ||
      pomoState === POMO_LONG_BREAK_RUNNING_STATE;
    const wasBreakBefore =
      prev === POMO_BREAK_RUNNING_STATE ||
      prev === POMO_LONG_BREAK_RUNNING_STATE;

    if (isBreakNow && !wasBreakBefore) {
      setShowBreathing(true);
    }
    prevPomoStateRef.current = pomoState;
  }, [pomoState]);

  // Fire session-complete modal every 4 pomodoros.
  useEffect(() => {
    const prev = prevCompletedPomosRef.current;
    if (
      completedPomos > 0 &&
      completedPomos % 4 === 0 &&
      completedPomos !== prev
    ) {
      setShowSessionComplete(true);
    }
    prevCompletedPomosRef.current = completedPomos;
  }, [completedPomos]);

  let doFullScreen = () => {
    dispatch(setIsTimerFullScreen(true));
  };

  let openSettingsModal = () => {
    dispatch(showClockSettingsModal());
  };

  let onPause = () => {
    dispatch(setIsTimerFullScreen(false));
  };

  let onTaskComplete = (task) => {
    dispatch(markTaskAsCompleteThunk({ task }));
    dispatch(pauseTimerAsync());
    dispatch(setIsTimerFullScreen(!false));
  };

  let scrollContainer = () => {
    if (containerRef.current) {
      scrollToEndOfContainer(containerRef.current, -100);
    }
  };

  let navigate = useNavigate();

  useEffect(() => {
    if (
      AuthService.isLoggedIn() &&
      window.location.pathname &&
      (window.location.pathname === "/" || window.location.pathname === "/app")
    ) {
      navigate("/home" + window.location.search);
    }
  }, []);

  return (
    <div
      className={
        styles["container"] + " " + (isTimerFullScreen && styles[timerBgColor])
      }
    >
      {showBreathing && (
        <BreathingExercise onDismiss={() => setShowBreathing(false)} />
      )}
      <SessionCompleteModal
        open={showSessionComplete}
        onClose={() => setShowSessionComplete(false)}
        completedPomos={completedPomos}
      />
      <KeyboardShortcutOverlay
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
      <button
        className={kbdStyles.triggerBadge}
        onClick={() => setShowShortcuts((v) => !v)}
        aria-label="Show keyboard shortcuts"
        title="Keyboard shortcuts (?)"
      >
        ?
      </button>
      <OnBoarding />
      <Settings />
      <ClockSettingsModal />
      <Navbar selected="0"></Navbar>
      <div
        className={`${styles["main-content"]} ${
          showSidebar ? styles["show-sidebar"] : styles["hide-sidebar"]
        }`}
      >
        {isTimerFullScreen && (
          <HideOnFullScreen>
            {/* <div className={styles["settings-icon-max"] + " delay"}>
              <SettingsIcon
                fill="rgb(134, 148, 201)"
                onClick={openSettingsModal}
              />
            </div> */}

            <div
              className={styles["shrink-icon"] + " delay"}
              onClick={(e) => toggleFullScreen()}
            >
              <ShrinkIcon /> Minimize
            </div>
          </HideOnFullScreen>
        )}
        <div className={styles["timer-container"] + " " + styles[timerBgColor]}>
          {!isTimerFullScreen && (
            <div className={styles["maximize-icon"]}>
              <MaximizeIcon onClick={doFullScreen} />
            </div>
          )}
          <div className={`${styles["timer"]}`}>
            <Timer
              onTimerStart={doFullScreen}
              onPause={onPause}
              onReset={(e) => dispatch(setIsTimerFullScreen(false))}
            ></Timer>
          </div>
          {isTimerFullScreen && getTab(pomoState) === TAB_POMODORO && (
            <div className={styles["current-task"]}>
              <CurrentTask onComplete={onTaskComplete} />
            </div>
          )}
        </div>
        <div
          ref={containerRef}
          className={`${styles["taskList"]} ${
            isTimerFullScreen && styles["shrink"]
          }`}
        >
          <TodaysTaskContainer
            toggleFullScreen={toggleFullScreen}
            onSave={scrollContainer}
          ></TodaysTaskContainer>
        </div>
        {/* <div className="sidebar-container">
                    <button onClick={this.toggleSidebar.bind(this)} className={`btn btn-simple btn-round ${this.state.showSidebarBtn ? '' : 'hide'}`}>All Tasks</button>
                    <AllTaskSidebar show={this.state.showSidebar} onClose={this.toggleSidebar.bind(this)}></AllTaskSidebar>
                </div> */}
      </div>
      {/* <div className={styles["footer-container"]}>
                <Footer></Footer>
            </div> */}
    </div>
  );
}
