import { Popover } from "@material-ui/core";
import { Delete, Edit, MoreHorizRounded, PlayArrow } from "@material-ui/icons";
import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { editTask } from "../../state/slices/GlobalSlice";
import { deleteTaskThunk, markTaskAsCurrent } from "../../state/slices/TasksSlice";
import { initiatePomo } from "../../state/slices/TimerSlice";

import "./task.scss";

export default function TaskItem(props) {

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

    let [anchorEl, setAnchorEl] = useState(null);

    let onMoreOptionsClick = useCallback((e) => {
        setAnchorEl(e.currentTarget);
    });

    let handleClose = useCallback((e) => {
        setAnchorEl(null);
    })

    return (
    
    <div className={`task ${task.isCurrentTask ? 'selected' : ''}`} >
        <span className="checkbox">
            <input type="radio" />
        </span>
        <span className="task-title">{task.title}</span>
        <div className="second-row">
            <span>2 / 3</span>
            <span className="project">project</span>
            <span className="tags">tags</span>
        </div>
        <span className="task-actions">
            <span className="task-actions-round edit" onClick={(e) => {doPlayTask(); e.stopPropagation()}}>
                <PlayArrow></PlayArrow>
            </span>
            <span className="task-actions-round more" onClick={(e) => {doDeleteTask(); e.stopPropagation()}}>
                <MoreHorizRounded onClick={onMoreOptionsClick}></MoreHorizRounded>
                <Popover
                open={Boolean(anchorEl)}
                id="more-options-popover"
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}>
                    <div className="more-options">
                    <div className="more-options-item">
                            <Edit></Edit>
                            <span>Edit task</span>
                        </div>
                        <div className="more-options-item">
                            <Delete></Delete>
                            <span>Delete task</span>
                        </div>
                    </div>
                </Popover>
            </span>
        </span>
    </div>
    );
}