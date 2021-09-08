import { Delete, Edit } from "@material-ui/icons";
import React from "react";
import { useDispatch } from "react-redux";
import { Task } from "../../models/Task";
import { editTask } from "../../state/slices/GlobalSlice";
import { deleteTaskThunk, markTaskAsCurrent } from "../../state/slices/TasksSlice";

import "./task.scss";

export function TaskItem(props) {
    let task: Task = props.task;
    let dispatch = useDispatch();

    let selectCurrentTask = () => {
        dispatch(markTaskAsCurrent(task));
    }

    let doEditTask = () => {
        dispatch(editTask(task));
    }

    let doDeleteTask = () => {
        dispatch(deleteTaskThunk(task));
    }

    return (
        <div className={`task ${task.isCurrentTask ? 'selected' : ''}`} onClick={(e) => selectCurrentTask()}>
            <span>{task.title}</span>
            <span className="task-actions">
                <span className="task-actions-round edit" onClick={(e) => {doEditTask(); e.stopPropagation()}}>
                    <Edit></Edit>
                </span>
                <span className="task-actions-round delete" onClick={(e) => {doDeleteTask(); e.stopPropagation()}}>
                    <Delete></Delete>
                </span>
            </span>
        </div>
    );
}