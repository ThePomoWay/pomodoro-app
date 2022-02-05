import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@material-ui/core";
import { ExpandMoreOutlined } from "@material-ui/icons";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTagsAsObj } from "../../state/selectors";
import {
  markTaskAsComplete,
  markTaskAsCompleteThunk,
  markTaskAsInCompleteThunk,
} from "../../state/slices/TasksSlice";
import TaskItem from "../task/task";
import styles from "./CompletedTaskList.module.scss";

export default (props) => {
  let tasks = props.tasks;
  let dispatch = useDispatch();
  let tags = useSelector(selectTagsAsObj);

  const toggleTaskComplete = useCallback((task) => {
    if (task.isComplete) {
      dispatch(
        markTaskAsInCompleteThunk({
          task,
          container: props.container,
          projectId: props.projectId,
          sectionId: props.sectionId,
        })
      );
    } else {
      dispatch(
        markTaskAsCompleteThunk({
          task,
          container: props.container,
          projectId: props.projectId,
          sectionId: props.sectionId,
        })
      );
    }
  });

  if (tasks && tasks.length > 0) {
    return (
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={
            <ExpandMoreOutlined
              style={{
                width: "28px",
                height: "28px",
                position: "relative",
                left: "-4px",
              }}
            />
          }
        >
          <p className={styles["title"]}>Completed Task</p>
          <span className={styles["summary"]}>
            {" "}
            <span className={styles["completed"]}>{tasks.length}</span>{" "}
            {props.totalTasks ? "out of " + props.totalTasks : "Completed"}{" "}
          </span>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles["tasklist"]}>
            {tasks.map((item) => (
              <TaskItem
                key={item.fid + "completed"}
                task={item}
                tags={tags}
                onComplete={toggleTaskComplete}
              />
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    );
  }
  return <div></div>;
};
