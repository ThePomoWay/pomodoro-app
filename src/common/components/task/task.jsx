import { Popover } from "@material-ui/core";
import { Add, Delete, Edit, MoreHorizRounded, PlayArrow, Remove, RemoveFromQueue, TimelapseOutlined } from "@material-ui/icons";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPomoState } from "../../state/selectors";
import { editTask } from "../../state/slices/GlobalSlice";
import { deleteTaskThunk, markTaskAsCurrent } from "../../state/slices/TasksSlice";
import { initiatePomo } from "../../state/slices/TimerSlice";
import { POMO_RUNNING_STATE } from "../../utils/constants";

import "./task.scss";

export default function TaskItem(props) {

    let task: Task = props.task;
    let showAddBtn = props.showAddBtn;
    let showRemoveBtn = props.showRemoveBtn;

    let dispatch = useDispatch();

    let pomoState = useSelector(selectPomoState);
    let isRunning = pomoState === POMO_RUNNING_STATE;

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
        if(!task.isCurrentTask){
            dispatch(markTaskAsCurrent(task));
            dispatch(initiatePomo());
        }
    }, [dispatch]);

    const doAddTask = useCallback(() => {
        props.doAddTask(task);
    });

    const doRemoveTask = useCallback(() => {
        props.doRemoveTask(task);
    })

    const getFirstCTA = useCallback(() => {
        if(showAddBtn) {
            return (
                <span className="task-actions-round add" onClick={(e) => {doAddTask(); e.stopPropagation()}}>
                { (<Add></Add>) }
                </span>
            )
        }
        if(showRemoveBtn) {
            return (
                <span className="task-actions-round add" onClick={(e) => {doRemoveTask(); e.stopPropagation()}}>
                { (<Remove></Remove>) }
                </span>
            )
        }
        return (<span className="task-actions-round edit" onClick={(e) => {doPlayTask(); e.stopPropagation()}}>
        { task.isCurrentTask && isRunning && (<TimelapseOutlined />) || (<PlayArrow></PlayArrow>) }
    </span>)
    })

    let [anchorEl, setAnchorEl] = useState(null);

    let onMoreOptionsClick = useCallback((e) => {
        setAnchorEl(e.currentTarget);
        e.stopPropagation();
    });

    let handleClose = useCallback((e) => {
        setAnchorEl(null);
    })

    let getEstimatedPomoHtml = useCallback(() => {
        if(task.estimatedPomos) {
            return (<span className="e-pomos"><div className="circle"> </div> {task.summary.cpomo} / <div className="circle circle-filled"></div>{ task.estimatedPomos }</span>)
        }
        return (<span className="e-pomos"><div className="circle"> </div> {task.summary.cpomo}</span>)
    })

    return (
    
    <div className={`task ${task.isCurrentTask ? 'selected' : ''}`} onClick={((e) => props.onClick(task))}>
        <span className="checkbox">
            <input type="radio" />
        </span>
        <span className="task-title">{task.title} {task.isCurrentTask &&  '(current task)'}</span>
        <div className="second-row">
            <span className="estimated-pomos-tag"> {getEstimatedPomoHtml()}</span>
            <span className="project">project</span>
            <span className="tags">
                {
                    Object.keys(props.tags).length >= task.labels.length && 
                    (
                        task.labels.map((item, ind) => (<span key={ind} className="tags-small" style={{borderColor: props.tags[item].color, color: props.tags[item].color}}>{props.tags[item].title}</span>))
                    )
                }
            </span>
        </div>
        <span className="task-actions">
            {getFirstCTA()}
            <span className="task-actions-round more">
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
                        <div className="more-options-item" onClick={(e) => {doEditTask(); e.stopPropagation()}}>
                            <Edit></Edit>
                            <span>Edit task</span>
                        </div>
                        <div className="more-options-item" onClick={(e) => {doDeleteTask(); e.stopPropagation()}}>
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