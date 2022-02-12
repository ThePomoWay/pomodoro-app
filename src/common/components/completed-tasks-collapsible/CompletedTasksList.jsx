import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@material-ui/core";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectProjectsObj, selectTagsAsObj } from "../../state/selectors";
import {
  markTaskAsCompleteThunk,
  markTaskAsInCompleteThunk,
} from "../../state/slices/TasksSlice";
import { ExpandMoreIcon } from "../../svgs/ExpandMoreIcon";
import TaskItem from "../task/task";
import styles from "./CompletedTaskList.module.scss";

export default (props) => {
  let tasks = props.tasks;
  let dispatch = useDispatch();
  let tags = useSelector(selectTagsAsObj);
  let projectsObj = useSelector(selectProjectsObj);

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
      <Accordion elevation={0} defaultExpanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <p className={styles["title"]}>
            {props.title || "Completed Task"}{" "}
            <span className={styles["completed"]}> ({tasks.length})</span>
          </p>
          {/* <span className={styles["summary"]}> */}{" "}
          {/* <span className={styles["completed"]}>{tasks.length}</span> */}
          {/* {" "}
            {props.totalTasks ? "out of " + props.totalTasks : "Completed"}{" "} */}
          {/* </span> */}
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles["tasklist"]}>
            {tasks.map((item) => (
              <TaskItem
                key={item.fid + "completed"}
                task={item}
                tags={tags}
                onComplete={toggleTaskComplete}
                projects={projectsObj}
              />
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    );
  }
  return <div></div>;
};
