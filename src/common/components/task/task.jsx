import { Popover } from "@material-ui/core";
import {
  Add,
  Delete,
  Edit,
  EditOutlined,
  MoreHorizRounded,
  PlayArrow,
  Remove,
  RemoveFromQueue,
  TimelapseOutlined,
} from "@material-ui/icons";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPomoState } from "../../state/selectors";
import { editTask } from "../../state/slices/GlobalSlice";
import {
  deleteTaskThunk,
  markTaskAsCompleteThunk,
  markTaskAsCurrent,
  markTaskAsInCompleteThunk,
  setEditTask,
} from "../../state/slices/TasksSlice";
import {
  initiatePomo,
  pauseTimer,
  pauseTimerAsync,
  resumeTimerAsync,
  updateTimerState,
} from "../../state/slices/TimerSlice";
import {
  POMO_PAUSED_STATE,
  POMO_RUNNING_STATE,
  priorityColorMap,
} from "../../utils/constants";
import { EditIcon } from "../edit-icon/EditIcon";

import { SunIcon } from "../../svgs/SunIcon";

import styles from "./task.module.scss";
import { AddTaskIcon } from "../../svgs/AddTaskIcon";
import { RemoveTaskIcon } from "../../svgs/RemoveTaskIcon";
import { TickIcon } from "../../svgs/TickIcon";
import { UncompleteIcon } from "../../svgs/UncompleteIcon";
import { DeleteIcon } from "../../svgs/DeleteIcon";
import { DismissTaskIcon } from "../../svgs/DismissTaskIcon";
import { TaskPauseIcon } from "../../svgs/TaskPauseIcon";
import { TaskPlayIcon } from "../../svgs/TaskPlayIcon";

export default function TaskItem(props) {
  let task: Task = props.task;
  let showAddBtn = props.showAddBtn;
  let showRemoveBtn = props.showRemoveBtn;

  let isEditable = props.isEditable || false;

  let dispatch = useDispatch();

  let pomoState = useSelector(selectPomoState);
  let isRunning = pomoState === POMO_RUNNING_STATE;

  const selectCurrentTask = useCallback(() => {
    dispatch(markTaskAsCurrent(task));
  }, [dispatch]);

  const doEditTask = useCallback(() => {
    dispatch(setEditTask(task.fid));
  }, [dispatch]);

  const doDeleteTask = useCallback(() => {
    dispatch(deleteTaskThunk(task));
  }, [dispatch, task]);

  const doPlayTask = () => {
    dispatch(markTaskAsCurrent(task));
    if (pomoState === POMO_PAUSED_STATE) {
      dispatch(resumeTimerAsync());
    } else if (pomoState !== POMO_RUNNING_STATE) {
      dispatch(
        updateTimerState({
          pomoStartTime: Date.now(),
          pomoState: POMO_RUNNING_STATE,
        })
      );
    }
  };

  const doPauseTask = () => {
    dispatch(pauseTimerAsync());
  };

  const doAddTask = useCallback(() => {
    props.doAddTask && props.doAddTask(task);
  });

  const doRemoveTask = useCallback(() => {
    props.doRemoveTask && props.doRemoveTask(task);
  });

  const toggleMarkAsComplete = useCallback((e) => {
    props.onComplete && props.onComplete(task);
    e.stopPropagation();
  });

  const getCTA = useCallback(() => {
    if (showAddBtn) {
      return (
        <span className={styles["task-actions-two"]}>
          <span
            className={styles["task-actions-round"]}
            onClick={(e) => {
              doAddTask();
              e.stopPropagation();
            }}
          >
            {<AddTaskIcon />}
          </span>
          {props.isEditable && (
            <span
              className={styles["task-actions-round"]}
              onClick={(e) => {
                doEditTask();
                e.stopPropagation();
              }}
            >
              {<EditIcon />}
            </span>
          )}
        </span>
      );
    }
    if (showRemoveBtn) {
      return (
        <span className={styles["task-actions-two"]}>
          <span
            className={styles["task-actions-round"]}
            onClick={(e) => {
              doRemoveTask();
              e.stopPropagation();
            }}
          >
            {<RemoveTaskIcon />}
          </span>

          {props.isEditable && (
            <span
              className={styles["task-actions-round"]}
              onClick={(e) => {
                doEditTask();
                e.stopPropagation();
              }}
            >
              {<EditIcon />}
            </span>
          )}
        </span>
      );
    }
    if (!props.hidePlay && props.isEditable) {
      // return (
      //   <span
      //     className={styles["task-actions-round"]}
      //     onClick={(e) => {
      //       doEditTask();
      //       e.stopPropagation();
      //     }}
      //   >
      //     {<EditIcon />}
      //   </span>
      // );
      return (
        <span className="task-actions-round edit">
          {(task.isCurrentTask && isRunning && (
            <TaskPauseIcon
              onClick={(e) => {
                doPauseTask();
                e.stopPropagation();
              }}
            />
          )) || (
            <TaskPlayIcon
              onClick={(e) => {
                doPlayTask();
                e.stopPropagation();
              }}
            />
          )}
        </span>
      );
    }
    return <span></span>;
  });

  let [anchorEl, setAnchorEl] = useState(null);

  let onMoreOptionsClick = useCallback((e) => {
    setAnchorEl(e.currentTarget);
    e.stopPropagation();
  });

  let handleClose = useCallback((e) => {
    setAnchorEl(null);
  });

  let getEstimatedPomoHtml = useCallback(() => {
    if (task.epomo) {
      return (
        <span className={styles["estimated-pomos-tag"]}>
          <span className={styles["e-pomos"]}>
            <div
              className={`circle-simple ${styles["completed"]} ${styles["pomo"]}`}
            >
              {" "}
            </div>{" "}
            {task.cpomo} /{" "}
            <div
              className={`circle ${styles["estimated"]} ${styles["pomo"]}`}
            ></div>
            {task.epomo}
          </span>
        </span>
      );
    }
    if (task.cpomo > 0) {
      return (
        <span className={styles["estimated-pomos-tag"]}>
          <span className={styles["e-pomos"]}>
            <div
              className={`circle-simple ${styles["completed"]} ${styles["pomo"]}`}
            >
              {" "}
            </div>{" "}
            {task.cpomo}
          </span>
        </span>
      );
    }
    return null;
  });

  return (
    <div
      className={`${styles["task"]} ${isEditable && styles["task-editable"]} ${
        task.isComplete && styles["task-completed"]
      } ${
        !props.hideWorkingOn && task.isCurrentTask ? styles["selected"] : ""
      }`}
      onClick={(e) => props.onClick && props.onClick(task)}
    >
      <div className={styles["first-column"]}>
        <div className={styles["first-row"]}>
          <span
            className={styles["checkbox"]}
            onClick={(e) => {
              toggleMarkAsComplete(e);
            }}
          >
            <span
              className={`${task.isComplete && styles["tick"]}`}
              value={!!task.isComplete}
              defaultChecked={!!task.isComplete}
              style={{ borderColor: priorityColorMap[task.priority] }}
            >
              <TickIcon />
            </span>
          </span>
          <span className={styles["task-title"]}>{task.title}</span>
        </div>
        <div className={styles["second-row"]}>
          {getEstimatedPomoHtml()}

          {task.project.projectID &&
            props.projects &&
            props.projects[task.project.projectID] && (
              <span className={styles["project"]}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3.25"
                    y="1.25"
                    width="9.5"
                    height="13.5"
                    rx="1.75"
                    fill="white"
                    stroke="black"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="5"
                    y1="4.75"
                    x2="11"
                    y2="4.75"
                    stroke="black"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="5"
                    y1="7.75"
                    x2="11"
                    y2="7.75"
                    stroke="black"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="5"
                    y1="10.75"
                    x2="11"
                    y2="10.75"
                    stroke="black"
                    strokeWidth="0.5"
                  />
                </svg>

                {props.projects[task.project.projectID].title}
              </span>
            )}

          {/* <span className={styles["tags"]}> */}
          {task.labels &&
            Object.keys(props.tags).length >= task.labels.length &&
            task.labels
              .filter((item) => props.tags[item])
              .map((item, ind) => (
                <span
                  key={ind}
                  className={styles["tags-small"]}
                  style={{
                    borderColor: props.tags[item].color,
                    color: props.tags[item].color,
                  }}
                >
                  #{props.tags[item].title}
                </span>
              ))}
          {/* </span> */}
        </div>
      </div>
      <div className={styles["second-column"]}>
        <span className={styles["task-actions"]}>
          {getCTA()}
          {!props.hideMoreOptions && (
            <span
              className={`${styles["task-actions-round"]} ${styles["more"]}`}
            >
              <MoreHorizRounded onClick={onMoreOptionsClick}></MoreHorizRounded>
              <Popover
                open={Boolean(anchorEl)}
                id="more-options-popover"
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <div className="popper-container">
                  {!task.isComplete && (
                    <div
                      className="popper-item"
                      onClick={(e) => {
                        doEditTask();
                        e.stopPropagation();
                      }}
                    >
                      <EditIcon style={{ width: "12px", height: "12px" }} />
                      <span>Edit task</span>
                    </div>
                  )}

                  {task.isComplete && (
                    <div
                      className="popper-item"
                      onClick={(e) => {
                        toggleMarkAsComplete();
                        e.stopPropagation();
                      }}
                    >
                      <UncompleteIcon />
                      <span>Uncomplete task</span>
                    </div>
                  )}

                  {props.showDismissOption && (
                    <div
                      className="popper-item"
                      onClick={(e) => {
                        doDeleteTask();
                        e.stopPropagation();
                      }}
                    >
                      <DismissTaskIcon />
                      <span>Remove from todays tasks</span>
                    </div>
                  )}

                  <div
                    className="popper-item"
                    onClick={(e) => {
                      doDeleteTask();
                      e.stopPropagation();
                    }}
                  >
                    <DeleteIcon />
                    <span>Delete task</span>
                  </div>
                </div>
              </Popover>
            </span>
          )}
        </span>
      </div>

      {task.isCurrentTask && !props.hideWorkingOn && (
        <div className={styles["selected-tag"]}> Working On</div>
      )}
    </div>
  );
}
