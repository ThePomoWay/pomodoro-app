import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProjectsObj,
  selectTagsAsObj,
  selectTodaysTaskIds,
} from "../../state/selectors";
import {
  addToTodaysTasks,
  markTaskAsCompleteThunk,
  removeFromTodaysTasks,
  updateTaskThunk,
} from "../../state/thunks/TasksThunk";
import { getObjFromArr } from "../../utils/common";
import EditTaskContainer from "../new-task-modal/EditTaskContainer";
import TaskItem from "../task/task";
import styles from "./UndraggableList.module.scss";

export default function UndraggableList(props) {
  let tags = useSelector(selectTagsAsObj);
  let projects = useSelector(selectProjectsObj);

  let todaysTaskIds = useSelector(selectTodaysTaskIds);
  let todaysTaskIdsObj = getObjFromArr(todaysTaskIds);

  let [editTaskfid, setEditTaskIndex] = useState("");

  let dispatch = useDispatch();

  const toggleCompletedTasks = useCallback((task) => {
    dispatch(markTaskAsCompleteThunk({ task }));
  });
  const doSetEditTask = useCallback((task) => {
    if (task.fid) {
      setEditTaskIndex(task.fid);
    }
  });

  const doSaveTask = useCallback((task) => {
    if (task.fid) {
      dispatch(updateTaskThunk(task));
    }

    setEditTaskIndex("");
  });

  const doAddTask = useCallback((task) => {
    dispatch(addToTodaysTasks({ fid: task.fid, _id: task._id }));
  });

  const doRemoveTask = (task) => {
    dispatch(removeFromTodaysTasks({ fid: task.fid, _id: task._id }));
  };

  if (props.tasks && props.tasks.length > 0) {
    return (
      <div className={styles["list"]}>
        {props.tasks.map((item, index) => {
          if (item.fid === editTaskfid) {
            return (
              <EditTaskContainer
                key={item.fid + "drag"}
                task={item}
                saveTask={doSaveTask}
              />
            );
          }

          return (
            <TaskItem
              showAddBtn={!(item.fid in todaysTaskIdsObj)}
              showRemoveBtn={item.fid in todaysTaskIdsObj}
              hidePlay={true}
              tags={tags}
              projects={projects}
              task={item}
              key={item.fid + "tags"}
              index={index}
              doAddTask={doAddTask}
              doRemoveTask={doRemoveTask}
              onComplete={toggleCompletedTasks}
              onClick={doSetEditTask}
              hideWorkingOn={props.hideWorkingOn}
            ></TaskItem>
          );
        })}
      </div>
    );
  }
  return <div>{props.emptyText || "No tasks found."}</div>;
}
