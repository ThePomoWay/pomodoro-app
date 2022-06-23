import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectHideFirstUserScreen,
  selectTagsAsObj,
  selectTodaysCompletedTasks,
  selectTodaysTasks,
  selectEditTaskRef,
  selectHideTodaysCompletedTasks,
} from "../../state/selectors";
import DraggableTaskList from "../draggable-task-list/DraggableTaskList";
import { AddNewTask } from "../new-task-btn/AddNewTask";
import { DragDropContext } from "react-beautiful-dnd";

import styles from "./todaysTaskContainer.module.scss";
import {
  clearTodaysTasksThunk,
  markTaskAsInCompleteThunk,
  rearrangeTodaysTask,
  removeFromTodaysTasks,
} from "../../state/thunks/TasksThunk";

import { DailyStats } from "../daily-stats/DailyStats";
import CompletedTasksList from "../completed-tasks-collapsible/CompletedTasksList";
import { ClickAwayListener, Popper } from "@mui/material";
import { MoreIconSvg } from "../../svgs/MoreIconSvg";
import { EditIconSvg } from "../../svgs/EditIconSvg";
import { Alert } from "../alert/Alert";
import {
  hideFirstUserScreen,
  toggleHideTodaysCompletedTasks,
} from "../../state/thunks/GlobalThunk";
import { useMediaQuery } from "react-responsive";

export function TodaysTaskContainer(props) {
  let tasks = useSelector(selectTodaysTasks);
  let completedTasks = useSelector(selectTodaysCompletedTasks);
  let tags = useSelector(selectTagsAsObj);

  let hideCompletedTasks = useSelector(selectHideTodaysCompletedTasks);

  let [moreAnchorEl, setMoreAnchorEl] = useState(null);
  let [showAlert, setShowAlert] = useState(false);
  let [isAddTaskOpen, setIsAddTaskOpen] = useState(true);

  let onClose = () => {
    setMoreAnchorEl(null);
  };

  let onPopperOpen = (e) => {
    setMoreAnchorEl(e.currentTarget);
  };

  let dispatch = useDispatch();

  let doRemoveFromToday = (task) => {
    dispatch(removeFromTodaysTasks({ fid: task.fid, _id: task._id }));
  };

  let onDragEnd = useCallback((result) => {
    if (result.destination && result.source) {
      if (
        result.destination.droppableId === result.source.droppableId &&
        result.destination.index === result.source.index
      ) {
        return;
      }

      dispatch(
        rearrangeTodaysTask({
          source: result.source.index,
          destination: result.destination.index,
        })
      );
    }
  }, []);

  let onTaskUncomplete = useCallback((task) => {
    dispatch(markTaskAsInCompleteThunk({ task, container: "todays" }));
  }, []);

  let onDeleteAllTasks = useCallback(() => {
    dispatch(clearTodaysTasksThunk());
    setShowAlert(false);
  }, []);

  let hideFirstScreen = () => {
    dispatch(hideFirstUserScreen());
    setIsAddTaskOpen(false);
  };

  let toggleHideCompletedTasks = () => {
    dispatch(toggleHideTodaysCompletedTasks());
  };

  return (
    <div className={styles["task-list"]}>
      <Alert
        title="Are you sure you want to remove all tasks?"
        description="You cannot revert this action."
        onClose={(e) => setShowAlert(false)}
        onSuccess={onDeleteAllTasks}
        showModal={showAlert}
      />
      <div className={styles["title-container"]}>
        <h1 className={styles["title"]}>Today's Tasks</h1>

        <ClickAwayListener onClickAway={onClose}>
          <div>
            <MoreIconSvg style={{ cursor: "pointer" }} onClick={onPopperOpen} />
            <Popper
              open={Boolean(moreAnchorEl)}
              id="more-today-popover"
              anchorEl={moreAnchorEl}
              onClose={onClose}
              position="bottom-left"
            >
              <div className="popper-container">
                {tasks.length > 0 && (
                  <div
                    className="popper-item"
                    onClick={(e) => setShowAlert(true)}
                  >
                    <EditIconSvg /> Remove all tasks
                  </div>
                )}
                <div
                  className="popper-item"
                  onClick={(e) => toggleHideCompletedTasks()}
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
                  </svg>{" "}
                  {hideCompletedTasks ? "Show" : "Hide"} completed tasks
                </div>
                {/* <div
                  className="popper-item"
                  onClick={(e) => {
                    props.toggleFullScreen && props.toggleFullScreen();
                    onClose();
                  }}
                >
                  <EditIconSvg /> Full screen
                </div> */}
              </div>
            </Popper>
          </div>
        </ClickAwayListener>
      </div>
      <div className={styles["daily-stats"]}>
        <DailyStats />
      </div>
      <div className={styles["task-container"]}>
        <DragDropContext onDragEnd={onDragEnd}>
          <DraggableTaskList
            container="todays"
            tasks={tasks}
            tags={tags}
            dropId="id-1e"
            isEditable="true"
            showDismissOption={true}
            removeFromToday={doRemoveFromToday}
          />
        </DragDropContext>
        <div className={styles["add-new-task"]}>
          <AddNewTask
            isTodaysTask={true}
            isOpen={!isAddTaskOpen}
            onSave={props.onSave}
          ></AddNewTask>
        </div>

        {completedTasks.length === 0 && tasks.length === 0 && (
          <div className={styles["completed-illustration"]}>
            {/* <img src="/illustrations/empty-todays.svg" /> */}
            <p className={styles["text"]}>
              Start your day by picking something from all tasks, or jot down
              tasks to be done today
            </p>
          </div>
        )}

        {/* {completedTasks.length > 0 && tasks.length == 0 && (
          <div className={styles["completed-illustration"]}>
            <img src="/illustrations/complete-todays.svg" />
            <p className={styles["text"]}>
              Awesome! You have completed all your tasks!
            </p>
          </div>
        )} */}

        {completedTasks.length > 0 && !hideCompletedTasks && (
          // (<div className={styles['completed-tasks']}>
          //     <p> Completed tasks </p>
          //     {completedTasks.map(item => (
          //         <TaskItem
          //             key={item.fid+'complete'}
          //             task={item}
          //             tags={tags}
          //             onComplete={onTaskUncomplete}
          //             />
          //     ))}
          // </div>)

          <div>
            <div className={styles["horizontal-rule"]}></div>
            <div className={styles["completed-tasks"]}>
              <CompletedTasksList
                container="todays"
                title="Todays Completed Tasks"
                tasks={completedTasks}
                totalTasks={tasks.length + completedTasks.length}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
