import { useState } from "react";
import { useDispatch } from "react-redux";
import CurrentTask from "../../../common/components/current-task/currentTask";
import Footer from "../../../common/components/footer/footer";
import Navbar from "../../../common/components/navbar/Navbar";
import { TodaysTaskContainer } from "../../../common/components/tasklist/TodaysTaskContainer";
import Timer from "../../../common/components/timer/timer";
import { markTaskAsCompleteThunk } from "../../../common/state/slices/TasksSlice";
import { ShrinkIcon } from "../../../common/svgs/ShrinkIcon";
import { POMO_RUNNING_STATE } from "../../../common/utils/constants";
import OnBoarding from "../../onboarding/Onboarding";
import useHomepage from "../HomePage-hook";

import styles from "./homepage-laptop.module.scss";

export function HomepageLaptop() {
  let {
    showSidebar,
    timerBgColor,
    isTimerFullScreen,
    toggleFullScreen,
    setIsTimerFullScreen,
  } = useHomepage();

  let dispatch = useDispatch();

  let onTimerStart = () => {
    setIsTimerFullScreen(true);
  };

  let onPause = () => {
    setIsTimerFullScreen(false);
  };

  let onTaskComplete = (task) => {
    dispatch(markTaskAsCompleteThunk({ task }));
    setIsTimerFullScreen(false);
  };

  return (
    <div className={styles["container"]}>
      <OnBoarding />
      <Navbar selected="0"></Navbar>
      <div
        className={`${styles["main-content"]} ${
          showSidebar ? styles["show-sidebar"] : styles["hide-sidebar"]
        }`}
      >
        {isTimerFullScreen && (
          <div
            className={styles["shrink-icon"] + " delay"}
            onClick={(e) => toggleFullScreen()}
          >
            <ShrinkIcon />
          </div>
        )}
        <div className={styles["timer-container"] + " " + styles[timerBgColor]}>
          <div className={`${styles["timer"]}`}>
            <Timer
              onTimerStart={onTimerStart}
              onPause={onPause}
              onReset={(e) => setIsTimerFullScreen(false)}
            ></Timer>
          </div>
          {isTimerFullScreen && (
            <div className={styles["current-task"]}>
              <CurrentTask onComplete={onTaskComplete} />
            </div>
          )}
        </div>
        <div
          className={`${styles["taskList"]} ${
            isTimerFullScreen && styles["shrink"]
          }`}
        >
          <TodaysTaskContainer
            toggleFullScreen={toggleFullScreen}
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
