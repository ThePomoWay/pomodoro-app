import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectHideFirstUserScreen,
  selectTagsAsObj,
  selectTodaysCompletedTasks,
  selectTodaysTasks,
  selectEditTaskRef,
} from "../../state/selectors";
import DraggableTaskList from "../draggable-task-list/DraggableTaskList";
import { AddNewTask } from "../new-task-btn/AddNewTask";
import { DragDropContext } from "react-beautiful-dnd";

import styles from "./todaysTaskContainer.module.scss";
import {
  clearTodaysTasksThunk,
  markTaskAsInCompleteThunk,
  rearrangeTodaysTask,
} from "../../state/slices/TasksSlice";

import { DailyStats } from "../daily-stats/DailyStats";
import CompletedTasksList from "../completed-tasks-collapsible/CompletedTasksList";
import { ClickAwayListener, Popper } from "@mui/material";
import { MoreIconSvg } from "../../svgs/MoreIconSvg";
import { EditIconSvg } from "../../svgs/EditIconSvg";
import { Alert } from "../alert/Alert";
import { hideFirstUserScreen } from "../../state/slices/GlobalSlice";

export function TodaysTaskContainer(props) {
  let tasks = useSelector(selectTodaysTasks);
  let completedTasks = useSelector(selectTodaysCompletedTasks);
  let tags = useSelector(selectTagsAsObj);

  let hideOnboardingScreen = useSelector(selectHideFirstUserScreen);

  let editTaskRef = useSelector(selectEditTaskRef);

  let [moreAnchorEl, setMoreAnchorEl] = useState(null);
  let [showAlert, setShowAlert] = useState(false);

  let onClose = () => {
    setMoreAnchorEl(null);
  };

  let onPopperOpen = (e) => {
    setMoreAnchorEl(e.currentTarget);
  };

  let dispatch = useDispatch();

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
  };

  if (!hideOnboardingScreen) {
    return (
      <div className={styles["empty-state"]}>
        <span className={styles["welcome-title"]}>👋 Welcome to PomoPanda</span>
        <div className={styles["create-task"]}>
          <div className={styles["text-container"]}>
            <span className={styles["text"]}>Create Tasks </span>
            to do today and start the timer
          </div>
          <div>
            <AddNewTask isTodaysTask={true} onToggle={hideFirstScreen} />
          </div>
        </div>
        <div className={styles["timer"]}>
          <div className={styles["or"]}>OR</div>
          <div className={styles["timer-text"]}>Simply Start the timer</div>
        </div>

        {/* <img src="/empty-tasks.png" alt="Empty tasks"/> */}
      </div>
    );
  }
  return (
    <div className={styles["task-list"]}>
      <Alert
        title="Are you sure you want to delete all tasks?"
        description="You cannot revert this action."
        onClose={(e) => setShowAlert(false)}
        onSuccess={onDeleteAllTasks}
        showModal={showAlert}
      />
      <div className={styles["title-container"]}>
        <span className={styles["title"]}>Today's Tasks</span>
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
                <div
                  className="popper-item"
                  onClick={(e) => setShowAlert(true)}
                >
                  <EditIconSvg /> Remove all tasks
                </div>
                <div
                  className="popper-item"
                  onClick={(e) => {
                    props.toggleFullScreen && props.toggleFullScreen();
                    onClose();
                  }}
                >
                  <EditIconSvg /> Full screen
                </div>
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
          />
        </DragDropContext>
        <div className={styles["add-new-task"]}>
          <AddNewTask isTodaysTask={true} isOpen={!!editTaskRef}></AddNewTask>
        </div>

        {completedTasks.length > 0 && (
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
