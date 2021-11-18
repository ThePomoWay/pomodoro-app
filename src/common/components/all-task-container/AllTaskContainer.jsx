import PlannerDraggableList from "../PlannerDraggableList/PlannerDraggableList";
import styles from "./AllTaskContainer.module.scss";

export default (props) => (
    <div className={styles['all-task-container']}>
        <div className={styles['all-task-list']}>
            <h2>Inbox</h2>
            <PlannerDraggableList isEditable={true} todaysTasksIds={props.todaysTasksIds} tasks={props.tasks} dropId="id-2e" />
        </div>
    </div>
)