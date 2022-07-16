import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DraggableTaskList from "../../common/components/draggable-task-list/DraggableTaskList";
import Navbar from "../../common/components/navbar/Navbar";

import {
  selectCompletedPomos,
  selectCompletedTaskInProject,
  selectDefaultTimes,
  selectHideProjectsCompletedTasks,
  selectLastAllTaskUrl,
  selectProjectsObj,
  selectTasksAsobj,
  selectTodaysTaskIds,
  selectTodaysTasks,
} from "../../common/state/selectors";
import {
  addToAllTasks,
  rearrangeAllTasks,
  removeFromAllTasks,
} from "../../common/state/slice/TasksSlice";
import {
  addToTodaysTasks,
  getAllTasks,
  getTodaysTasks,
  rearrangeTodaysTask,
  removeFromTodaysTasks,
} from "../../common/state/thunks/TasksThunk";
import {
  TASK_VARIANT_TODAYS,
  todaysTasksDropId,
} from "../../common/utils/constants";

import { DragDropContext } from "react-beautiful-dnd";

import AllTaskContainer from "../../common/components/all-task-container/AllTaskContainer";
import {
  getObjFromArr,
  scrollToEndOfContainer,
} from "../../common/utils/common";
import styles from "./AllTasks.module.scss";

import { Route, Switch, useRouteMatch } from "react-router-dom";
import AllTaskSidebar from "../../common/components/all-task-sidebar/AllTaskSidebar";
import NewProjectContainer from "../../common/components/new-project-container/NewProjectContainer";

import { ClickAwayListener, Popper } from "@material-ui/core";
import { MoreHorizRounded } from "@material-ui/icons";
import AuthService from "../../common/API/network/AuthService";
import CompletedTasksList from "../../common/components/completed-tasks-collapsible/CompletedTasksList";
import LabelContainer from "../../common/components/label-container/LabelContainer";
import NewLabelContainer from "../../common/components/new-label-container/NewLabelContainer";
import { AddNewTask } from "../../common/components/new-task-btn/AddNewTask";
import PriorityContainer from "../../common/components/priority-container/PriorityContainer";
import { ProjectContainer } from "../../common/components/project-container/ProjectContainer";
import { getAllTags } from "../../common/state/thunks/TagsThunk";
import { getTimerState } from "../../common/state/thunks/TimerThunk";
import { getTimeText } from "../../common/utils/date-utils";
import OnBoarding from "../onboarding/Onboarding";

import { useHistory } from "react-router-dom";
import { setLastAllTaskUrl } from "../../common/state/slice/GlobalSlice";
import { toggleHideProjectsCompletedTasks } from "../../common/state/thunks/GlobalThunk";
import {
  getAllProjects,
  rearrangeTaskInProjectAsync,
} from "../../common/state/thunks/ProjectThunk";
import usePageTracking from "../../usePageTracking";
import CompletedTasks from "../completed-tasks/completed-tasks";
import Settings from "../settings/Settings";
import { toggleHideProjectsCompletedTasks } from "../../common/state/thunks/GlobalThunk";
import CompletedTasks from "../completed-tasks/completed-tasks";

export default function AllTasks() {
  let todaystasks = useSelector(selectTodaysTasks);

  let todaysTaskIds = useSelector(selectTodaysTaskIds);
  let todaysTaskIdsObj = getObjFromArr(todaysTaskIds);

  let tasksObj = useSelector(selectTasksAsobj);

  let projectsObj = useSelector(selectProjectsObj);
  let cPomos = useSelector(selectCompletedPomos);
  let defaults = useSelector(selectDefaultTimes);
  let showCompletedSection = useSelector(selectHideProjectsCompletedTasks);

  let containerRef = useRef(null);

  let dispatch = useDispatch();

  usePageTracking();

  let [todaysTaskOpen, setTodaysTaskOpen] = useState(true);
  let [moreAnchorEl, setMoreAnchorEl] = useState(false);

  let completedTasks = useSelector(
    selectCompletedTaskInProject(AuthService.getInboxProjectId(), "")
  );

  let lastUrl = useSelector(selectLastAllTaskUrl);
  let history = useHistory();
  useEffect(() => {
    return history.listen((location) => {
      if (location.pathname.startsWith("/all")) {
        dispatch(setLastAllTaskUrl(location.pathname));
      }
    });
  }, [dispatch, history]);

  useEffect(() => {
    if (window.location.pathname !== lastUrl) {
      history.push(lastUrl);
    }
  }, [history, lastUrl]);

  let projectId = AuthService.getInboxProjectId();

  let allTaskIds = (projectsObj[projectId] && projectsObj[projectId].to) || [];
  let alltasks = allTaskIds
    .filter((item) => tasksObj[item])
    .map((item) => tasksObj[item]);

  useEffect(() => {
    dispatch(getAllTasks());
    dispatch(getTodaysTasks());
    dispatch(getAllProjects());
    dispatch(getAllTags());
    dispatch(getTimerState());
  }, [dispatch]);

  let onDragEnd = (result) => {
    if (result.destination && result.source) {
      if (
        result.destination.droppableId === result.source.droppableId &&
        result.destination.index === result.source.index
      ) {
        return;
      }

      if (result.destination.droppableId === result.source.droppableId) {
        if (result.source.droppableId !== todaysTasksDropId) {
          let projectId = AuthService.getInboxProjectId();
          let projectCopy = JSON.parse(JSON.stringify(projectsObj[projectId]));

          let taskId = result.draggableId.split("task-")[1];

          // let source = {
          //   isSection: false,
          //   hid: projectId,
          //   to: [],
          // };
          let destination = {
            isSection: false,
            hid: projectId,
            to: [],
          };

          projectCopy.to.splice(result.source.index, 1);

          projectCopy.to.splice(result.destination.index, 0, taskId);
          destination.to = projectCopy.to.map((item) => tasksObj[item]._id);

          dispatch(
            rearrangeTaskInProjectAsync({
              body: {
                source: destination,
                destination,
                taskId: tasksObj[taskId]._id,
                projectId: projectId,
                isSame: true,
              },
              project: projectCopy,
            })
          );

          // dispatch(updateLocalProjectAsync(projectCopy));
        }

        let action =
          result.source.droppableId === todaysTasksDropId
            ? rearrangeTodaysTask
            : rearrangeAllTasks;
        dispatch(
          action({
            source: result.source.index,
            destination: result.destination.index,
          })
        );
      } else {
        let removeAction =
          result.source.droppableId === todaysTasksDropId
            ? removeFromTodaysTasks
            : removeFromAllTasks;
        let addAction;
        let item;

        if (result.destination.droppableId === todaysTasksDropId) {
          addAction = addToTodaysTasks;
          item = todaystasks[result.source.index].fid;
        } else {
          addAction = addToAllTasks;
          item = alltasks[result.source.index].fid;
        }

        dispatch(
          removeAction({
            index: result.source.index,
          })
        );

        dispatch(
          addAction({
            index: result.destination.index,
            item,
          })
        );
      }
    }
  };

  const doRemoveTask = (task) => {
    dispatch(
      removeFromTodaysTasks({
        fid: task.fid,
        _id: task._id,
      })
    );
  };

  let { path } = useRouteMatch();

  let ePomos = 0;
  for (let task of todaystasks) {
    ePomos += task.epomo;
  }
  let estimatedTimeLeft = "";
  if (ePomos > 0 && ePomos > cPomos) {
    estimatedTimeLeft =
      "~" + getTimeText(((ePomos - cPomos) * defaults.defaultWorkTime) / 60);
  }

  let onMoreClose = () => {
    setMoreAnchorEl(null);
  };

  let onMoreAnchorClick = (e) => {
    setMoreAnchorEl(e.currentTarget);
  };

  let scrollToView = () => {
    if (containerRef.current) {
      scrollToEndOfContainer(containerRef.current);
    }
  };

  return (
    <div className={styles["container"]}>
      {!AuthService.isLoggedIn() && <OnBoarding />}

      {AuthService.isLoggedIn() && <Settings />}
      <div>
        <Navbar selected="1"></Navbar>
      </div>
      <div className={styles["main-view"]}>
        <div className={styles.sidebar}>
          <AllTaskSidebar></AllTaskSidebar>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className={styles["middle-container"]} ref={containerRef}>
            <div className={styles["route"]}>
              <Switch>
                <Route exact path={path}>
                  <div className={styles["all-tasks-container"]}>
                    <div className={styles["title"]}>
                      <span>Inbox</span>
                      <span>
                        <ClickAwayListener onClickAway={onMoreClose}>
                          <div>
                            <MoreHorizRounded
                              style={{ fill: "#7586E3", cursor: "pointer" }}
                              onClick={onMoreAnchorClick}
                            />
                            <Popper
                              open={Boolean(moreAnchorEl)}
                              id="project-popover"
                              anchorEl={moreAnchorEl}
                              onClose={onMoreClose}
                              position="bottom-left"
                            >
                              <div className="popper-container">
                                <div
                                  className="popper-item"
                                  onClick={(e) => {
                                    dispatch(
                                      toggleHideProjectsCompletedTasks()
                                    );
                                    onMoreClose();
                                  }}
                                >
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <circle
                                      cx="6"
                                      cy="6"
                                      r="4"
                                      stroke="#6A6F9A"
                                      strokeWidth="0.7"
                                    />
                                    <path
                                      d="M4.5 6L6 7.5L11 2.5"
                                      stroke="#6A6F9A"
                                      strokeWidth="0.7"
                                    />
                                  </svg>
                                  {showCompletedSection ? "Hide" : "Show"}{" "}
                                  Completed Tasks
                                </div>
                              </div>
                            </Popper>
                          </div>
                        </ClickAwayListener>
                      </span>
                    </div>
                    <div className={styles["add-task-btn"]}>
                      <AddNewTask
                        isTodaysTask={false}
                        onSave={scrollToView}
                        variant="btn-save-2"
                      />
                    </div>

                    {alltasks.length === 0 && completedTasks.length === 0 && (
                      <div className={styles["illustration"]}>
                        {/* <img src="/illustrations/empty-all.svg" /> */}
                        <p className={styles["text"]}>
                          Organize your tasks and lists here.
                        </p>
                      </div>
                    )}

                    <AllTaskContainer
                      todaysTasksIds={todaysTaskIdsObj}
                      tasks={alltasks}
                      container="all"
                    />
                    {showCompletedSection && (
                      <div className={styles["completed-section"]}>
                        <CompletedTasksList
                          container="projects"
                          projectId={AuthService.getInboxProjectId()}
                          tasks={completedTasks}
                        />
                      </div>
                    )}
                  </div>
                </Route>

                <Route exact path={`${path}/project`}>
                  <NewProjectContainer />
                </Route>

                <Route path={`${path}/project/:projectId`}>
                  <ProjectContainer scroll={scrollToView} />
                </Route>

                <Route exact path={`${path}/labels`}>
                  <NewLabelContainer />
                </Route>
                <Route path={`${path}/labels/:labelId`}>
                  <LabelContainer />
                </Route>

                <Route path={`${path}/priority/:priority`}>
                  <PriorityContainer />
                </Route>

                <Route path={`${path}/completed-tasks`}>
                  <CompletedTasks />
                </Route>
              </Switch>
            </div>
            {window.location.pathname !== "/all/completed-tasks" && (
              <div className={styles["right-container"]}>
                <div
                  className={`${styles["todays-task-container"]} ${
                    todaysTaskOpen ? styles["open"] : styles["closed"]
                  }`}
                  style={{
                    visibility: todaysTaskOpen ? "visible" : "hidden",
                    width: todaysTaskOpen ? "25vw" : "100px",
                  }}
                >
                  <div className={`${styles["todays-task-list"]}`}>
                    <h2
                      className={styles["title"]}
                      onClick={(e) => setTodaysTaskOpen(false)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.33333 13.334L10.6667 8.00065L5.33334 2.66732"
                          stroke="#3C50BE"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      Todays Tasks&nbsp;
                      {ePomos > 0 && (
                        <span className={styles["estimate-text"]}>
                          ({ePomos} Pomos)
                        </span>
                      )}
                      {ePomos > 0 && (
                        <span className={styles["right"]}>
                          {estimatedTimeLeft && (
                            <span className={styles["estimate-text"]}>
                              {estimatedTimeLeft}
                            </span>
                          )}
                        </span>
                      )}
                    </h2>

                    {(todaystasks.length > 0 && (
                      <DraggableTaskList
                        hidePlay={true}
                        tasks={todaystasks}
                        showRemoveBtn={true}
                        doRemoveTask={doRemoveTask}
                        isEditable={false}
                        dropId="id-1e"
                        hideWorkingOn={true}
                        variant={TASK_VARIANT_TODAYS}
                      />
                    )) || (
                      <div className={styles["illustration"]}>
                        <img src="/illustrations/empty-today-mini.svg" />
                        <p className={styles["text-light"]}>
                          Tap on the plus button in the tasks to add to today’s
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {!todaysTaskOpen && (
                  <div className={styles["todays-task-btn"]}>
                    <button
                      className="btn btn-theme"
                      onClick={(e) => setTodaysTaskOpen(true)}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 2L4 6L8 10"
                          stroke="#7586E3"
                          strokeWidth="0.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DragDropContext>
      </div>
      <NewProjectContainer />
      <NewLabelContainer />
    </div>
  );
}
