import { Add } from "@material-ui/icons";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AuthService from "../../API/network/AuthService";
import { addTaskToProjectLocal } from "../../state/slices/ProjectSlice";
import { createTaskThunk } from "../../state/slices/TasksSlice";
import { AddIcon } from "../../svgs/AddIcon";
import EditTaskContainer from "../new-task-modal/EditTaskContainer";

import styles from "./AddNewTask.module.scss";

export function AddNewTask(props) {
  const dispatch = useDispatch();

  let [showBtn, setShowBtn] = useState(!props.isOpen || true);

  useEffect(() => {
    if (props.isOpen) {
      setShowBtn(props.isOpen);
    }
  }, [props.isOpen]);

  let doSaveTask = (task) => {
    if (task.fid) {
      if (!task.project.projectID) {
        task.project.projectID = AuthService.getInboxProjectId();
      }
      if (task.project.projectID === AuthService.getInboxProjectId()) {
        dispatch(
          addTaskToProjectLocal({
            taskId: task.fid,
            projectId: AuthService.getInboxProjectId(),
          })
        );
      }
      dispatch(
        createTaskThunk({
          task,
          isTodaysTask: props.isTodaysTask,
        })
      );
      props.onSave && props.onSave(task);
    } else {
      onToggle();
    }
  };

  let onToggle = () => {
    setShowBtn(!showBtn);
    props.onToggle && props.onToggle(!showBtn);
  };

  if (showBtn) {
    return (
      <button
        className={`btn btn-simple ${styles["add-task-btn"]}`}
        onClick={(e) => onToggle()}
      >
        <AddIcon /> CREATE TASK
      </button>
    );
  }
  return <EditTaskContainer saveTask={doSaveTask} {...props} />;
}
