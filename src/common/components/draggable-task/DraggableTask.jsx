import { Task } from "../../models/Task";

import { Draggable } from "react-beautiful-dnd";

import TaskItem from "../task/task";

import styles from "./DraggableTask.module.scss";

export function DraggableTaskItem(props) {
  let task: Task = props.task;

  if (!task) {
    return <div></div>;
  }

  return (
    <Draggable draggableId={props.dropId + task.fid} index={props.index}>
      {(provided, snapshot) => {
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={styles["draggable-task"]}
            ref={provided.innerRef}
          >
            <TaskItem
              showAddBtn={props.showAddBtn}
              showRemoveBtn={props.showRemoveBtn}
              doRemoveTask={props.doRemoveTask}
              doAddTask={props.doAddTask}
              task={task}
              onClick={props.onClick}
              tags={props.tags}
              projects={props.projects}
              hidePlay={props.hidePlay}
              onComplete={props.onComplete}
              isEditable={props.isEditable}
              hideWorkingOn={props.hideWorkingOn}
              removeFromToday={props.removeFromToday}
              showDismissOption={props.showDismissOption}
              variant={props.variant}
            ></TaskItem>
          </div>
        );
      }}
    </Draggable>
  );
}
