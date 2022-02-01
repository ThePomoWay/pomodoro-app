import { Flag, Label } from "@material-ui/icons";
import styles from "./PriorityContainer.module.scss";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTasksFromPriority } from "../../state/selectors";
import UndraggableList from "../undraggable-list/UndraggableList";
import { priorityColorMap } from "../../utils/constants";

export default function PriorityContainer(props) {
  let { priority } = useParams();

  let tasks = useSelector(selectTasksFromPriority(priority));

  if (!tasks.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        {/* <Flag style={{ fill: priorityColorMap[priority] }} /> */}
        <h2 className="font-title">Priority {priority}</h2>
      </div>
      <UndraggableList tasks={tasks} />
    </div>
  );
}
