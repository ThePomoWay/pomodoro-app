import { Delete, PlayArrow } from "@material-ui/icons";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Task } from "../../models/Task";
import { editTask } from "../../state/slices/GlobalSlice";
import { deleteTaskThunk, markTaskAsCurrent } from "../../state/slices/TasksSlice";
import { initiatePomo } from "../../state/slices/TimerSlice";

import "./task.scss";


export function TaskItem(props) {
    let task: Task = props.task;
    let dispatch = useDispatch();

    const selectCurrentTask = useCallback(() => {
        dispatch(markTaskAsCurrent(task));
    }, [dispatch]);

    const doEditTask = useCallback(() => {
        dispatch(editTask(task));
    }, [dispatch]);

    const doDeleteTask = useCallback(() => {
        dispatch(deleteTaskThunk(task));
    }, [dispatch]);

    const doPlayTask = useCallback(() => {
        dispatch(markTaskAsCurrent(task));
        dispatch(initiatePomo());
    }, [dispatch]);

    return (
        <div className={`task ${task.isCurrentTask ? 'selected' : ''}`} onClick={(e) => doEditTask()}>
            <span>{task.title}</span>
            <span className="task-actions">
                <span className="task-actions-round edit" onClick={(e) => {doPlayTask(); e.stopPropagation()}}>
                    <PlayArrow></PlayArrow>
                </span>
                <span className="task-actions-round delete" onClick={(e) => {doDeleteTask(); e.stopPropagation()}}>
                    <Delete></Delete>
                </span>
            </span>
        </div>
    );
}