import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectTasksFromPriority } from "../../state/selectors";
import { setLastAllTaskUrl } from "../../state/slice/GlobalSlice";
import { priorityName } from "../../utils/constants";
import UndraggableList from "../undraggable-list/UndraggableList";
import styles from "./PriorityContainer.module.scss";

export default function PriorityContainer(props) {
  let { priority } = useParams();

  let tasks = useSelector(selectTasksFromPriority(priority));

  let dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLastAllTaskUrl(window.location.pathname));
  }, [dispatch]);

  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        {/* <Flag style={{ fill: priorityColorMap[priority] }} /> */}
        <h2 className="font-title"> {priorityName[priority - 1]}</h2>
      </div>
      <UndraggableList
        tasks={tasks}
        emptyText={"No tasks found with this priority"}
        hideWorkingOn={true}
      />
    </div>
  );
}
