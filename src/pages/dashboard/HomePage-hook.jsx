import React, { Component, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectIsTimerFullScreen,
  selectPomoState,
  selectHideFirstUserScreen,
} from "../../common/state/selectors";
import { getAllProjects } from "../../common/state/thunks/ProjectThunk";
import { getAllTags } from "../../common/state/thunks/TagsThunk";
import { getTodaysTasks } from "../../common/state/thunks/TasksThunk";
import { getTimerState } from "../../common/state/thunks/TimerThunk";
import { getAllTasks } from "../../common/state/thunks/TasksThunk";
import {
  POMO_BREAK_RUNNING_STATE,
  POMO_LONG_BREAK_RUNNING_STATE,
  POMO_RUNNING_STATE,
} from "../../common/utils/constants";
import "./home.scss";
import { setIsTimerFullScreen } from "../../common/state/slice/GlobalSlice";

let initialized = false;

export default function useHomepage() {
  let dispatch = useDispatch();

  let [showSidebar, setShowSidebar] = useState(false);

  let isTimerFullScreen = useSelector(selectIsTimerFullScreen);

  let pomoState = useSelector(selectPomoState);
  let hideOnboardingScreen = useSelector(selectHideFirstUserScreen);

  let timerBgColor = "purple";
  if (pomoState.startsWith("pomo_break")) {
    timerBgColor = "pink";
  } else if (pomoState.startsWith("pomo_long_break")) {
    timerBgColor = "cyan";
  }
  let toggleSidebar = useCallback(() => {
    if (this.state.showSidebar) {
      setTimeout(
        () => this.setState({ showSidebarBtn: !this.state.showSidebarBtn }),
        500
      );
    } else {
      this.setState({ showSidebarBtn: !this.state.showSidebarBtn });
    }

    this.setState({ showSidebar: !this.state.showSidebar });
  });

  let toggleFullScreen = () => {
    dispatch(setIsTimerFullScreen(!isTimerFullScreen));
  };

  useEffect(() => {
    dispatch(getAllTasks());
    dispatch(getTimerState());
    dispatch(getAllProjects());
    dispatch(getAllTags());
    setTimeout(() => dispatch(getTodaysTasks()), 0);
  }, []);

  useEffect(() => {
    if (!initialized) {
      if (
        (pomoState === POMO_RUNNING_STATE ||
          pomoState === POMO_BREAK_RUNNING_STATE ||
          pomoState === POMO_LONG_BREAK_RUNNING_STATE) &&
        !isTimerFullScreen
      ) {
        dispatch(setIsTimerFullScreen(true));
      } else if (
        pomoState !== POMO_RUNNING_STATE &&
        pomoState !== POMO_BREAK_RUNNING_STATE &&
        pomoState !== POMO_LONG_BREAK_RUNNING_STATE &&
        isTimerFullScreen
      ) {
        dispatch(setIsTimerFullScreen(false));
      }

      initialized = true;
    }
  }, []);

  return {
    showSidebar,
    setShowSidebar,
    toggleSidebar,
    timerBgColor,
    isTimerFullScreen,
    toggleFullScreen,
    pomoState,
    hideOnboardingScreen,
  };
}
