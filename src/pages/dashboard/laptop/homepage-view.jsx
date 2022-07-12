import { SettingsApplicationsOutlined } from "@material-ui/icons";
import { useRef } from "react";
import { useDispatch } from "react-redux";
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

  return (
    <div className={styles["container"]}>
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
          <>
            <div className={styles["settings-icon-max"] + " delay"}>
              <SettingsIcon
                fill="rgb(134, 148, 201)"
                onClick={openSettingsModal}
              />
            </div>
            <div
              className={styles["shrink-icon"] + " delay"}
              onClick={(e) => toggleFullScreen()}
            >
              <ShrinkIcon /> Minimize
            </div>
          </>
        )}
        <div className={styles["timer-container"] + " " + styles[timerBgColor]}>
          {!isTimerFullScreen && (
            <>
              <div className={styles["maximize-icon"]}>
                <MaximizeIcon onClick={doFullScreen} />
              </div>
              {/* <div className={styles["settings-icon"]}>
                <SettingsIcon
                  fill="rgb(134, 148, 201)"
                  onClick={openSettingsModal}
                />
              </div> */}
            </>
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
