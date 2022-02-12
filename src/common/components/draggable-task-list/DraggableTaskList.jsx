import React, { useCallback } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEditTask,
  selectProjectsObj,
  selectTagsAsObj,
} from "../../state/selectors";
import {
  markTaskAsCompleteThunk,
  markTaskAsCurrent,
  markTaskAsInCompleteThunk,
  setEditTask,
  unMarkTaskAsCurrent,
  updateTaskThunk,
} from "../../state/slices/TasksSlice";
import { DraggableTaskItem } from "../draggable-task/DraggableTask";
import EditTaskContainer from "../new-task-modal/EditTaskContainer";

import styles from "./draggableList.module.scss";

export default (props) => {
  let editableTask = useSelector(selectEditTask);
  let tags = useSelector(selectTagsAsObj);
  let projects = useSelector(selectProjectsObj);

  let dispatch = useDispatch();

  let doSaveTask = useCallback((item) => {
    if (item && item.fid) {
      dispatch(updateTaskThunk(item));
    }
    dispatch(setEditTask(""));
  });

  let markAsCurrent = useCallback((item) => {
    if (!item.isCurrentTask) {
      dispatch(markTaskAsCurrent(item));
    } else {
      dispatch(unMarkTaskAsCurrent(item));
    }
  });

  let doSetEditTask = useCallback((item) => {
    dispatch(setEditTask(item.fid));
    props.onEdit && props.onEdit(item);
  });

  let toggleCompletedTasks = useCallback((task) => {
    if (!task.isComplete) {
      dispatch(markTaskAsCompleteThunk({ task, container: props.container }));
    } else {
      dispatch(markTaskAsInCompleteThunk({ task, container: props.container }));
    }
  });

  return (
    <Droppable droppableId={props.dropId} type="all">
      {(provided) => {
        return (
          <div
            className={styles["task-container"]}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {props.tasks.map((item, index) => {
              if (!item) {
                return <div></div>;
              }
              if (
                props.isEditable &&
                editableTask &&
                editableTask.fid === item.fid
              ) {
                return (
                  <div className={styles["edit-task-container"]}>
                    <EditTaskContainer
                      key={item.fid}
                      task={item}
                      saveTask={doSaveTask}
                    />
                  </div>
                );
              }
              return (
                <DraggableTaskItem
                  hidePlay={props.hidePlay}
                  tags={tags}
                  projects={projects}
                  task={item}
                  key={item.fid}
                  index={index}
                  dropId={props.dropId}
                  onComplete={toggleCompletedTasks}
                  onClick={doSetEditTask}
                  isEditable={props.isEditable}
                  showRemoveBtn={props.showRemoveBtn}
                  hideWorkingOn={props.hideWorkingOn}
                />
              );
            })}
            {provided.placeholder}
          </div>
        );
      }}
    </Droppable>
  );
};
