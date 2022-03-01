import { Flag, Label } from "@material-ui/icons";
import styles from "./PriorityContainer.module.scss";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectTasksFromPriority } from "../../state/selectors";
import UndraggableList from "../undraggable-list/UndraggableList";
import { priorityColorMap } from "../../utils/constants";
import { useEffect } from "react";
import { setLastAllTaskUrl } from "../../state/slices/GlobalSlice";

export default function PriorityContainer(props) {
  let { priority } = useParams();

  let tasks = useSelector(selectTasksFromPriority(priority));

  let dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLastAllTaskUrl(window.location.pathname));
  }, []);

  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        {/* <Flag style={{ fill: priorityColorMap[priority] }} /> */}
        <h2 className="font-title">Priority {priority}</h2>
      </div>
      <UndraggableList
        tasks={tasks}
        emptyText={"No tasks found with this priority"}
      />
    </div>
  );
}
