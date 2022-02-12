import { current } from "@reduxjs/toolkit";
import React from "react";
import { useSelector } from "react-redux";
import {
  selectCurrentTask,
  selectProjectsObj,
  selectTagsAsObj,
} from "../../state/selectors";
import TaskItem from "../task/task";

import styles from "./currentTask.module.scss";

export default function CurrentTask() {
  let currentTask = useSelector(selectCurrentTask);
  let tagsObj = useSelector(selectTagsAsObj);
  let projectsObj = useSelector(selectProjectsObj);
  if (!currentTask || !currentTask.title) {
    return <div></div>;
  }
  return (
    <div className={styles["content"]}>
      <p className={styles["title"]}>Working On</p>
      <TaskItem task={currentTask} projects={projectsObj} tags={tagsObj} />
    </div>
  );
}
