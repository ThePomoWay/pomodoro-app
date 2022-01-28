import { Popover } from "@material-ui/core";
import { Add, Delete, Edit, EditOutlined, MoreHorizRounded, PlayArrow, Remove, RemoveFromQueue, TimelapseOutlined } from "@material-ui/icons";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPomoState } from "../../state/selectors";
import { editTask } from "../../state/slices/GlobalSlice";
import { deleteTaskThunk, markTaskAsCompleteThunk, markTaskAsCurrent, markTaskAsInCompleteThunk, setEditTask } from "../../state/slices/TasksSlice";
import { initiatePomo } from "../../state/slices/TimerSlice";
import { POMO_RUNNING_STATE, priorityColorMap } from "../../utils/constants";
import { EditIcon } from "../edit-icon/EditIcon";

import styles from "./task.module.scss";

export default function TaskItem(props) {

    let task: Task = props.task;
    let showAddBtn = props.showAddBtn;
    let showRemoveBtn = props.showRemoveBtn;

    let isEditable = props.isEditable || false;

    let dispatch = useDispatch();

    let pomoState = useSelector(selectPomoState);
    let isRunning = pomoState === POMO_RUNNING_STATE;

    const selectCurrentTask = useCallback(() => {
        dispatch(markTaskAsCurrent(task));
    }, [dispatch]);

    const doEditTask = useCallback(() => {
        dispatch(setEditTask(task.fid));
    }, [dispatch]);

    const doDeleteTask = useCallback(() => {
        dispatch(deleteTaskThunk(task));
    }, [dispatch, task]);

    const doPlayTask = useCallback(() => {
        if(!task.isCurrentTask){
            dispatch(markTaskAsCurrent(task));
            dispatch(initiatePomo());
        }
    }, [dispatch]);

    const doAddTask = useCallback(() => {
        props.doAddTask && props.doAddTask(task);
    });

    const doRemoveTask = useCallback(() => {
        props.doRemoveTask && props.doRemoveTask(task);
    });

    const toggleMarkAsComplete = useCallback((e) => {
        props.onComplete && props.onComplete(task);
        e.stopPropagation();
    })

    const getFirstCTA = useCallback(() => {
        if(showAddBtn) {
            return (
                <span className={styles["task-actions-round"]} onClick={(e) => {doAddTask(); e.stopPropagation()}}>
                { (<Add></Add>) }
                </span>
            )
        }
        if(showRemoveBtn) {
            return (
                <span className={styles["task-actions-round"]} onClick={(e) => {doRemoveTask(); e.stopPropagation()}}>
                { (<Remove></Remove>) }
                </span>
            )
        }
        if(!props.hidePlay && props.isEditable) {
            return (<span className={styles["task-actions-round"]} onClick={(e) => {doEditTask(); e.stopPropagation()}}>
            { task.isCurrentTask && isRunning && (<TimelapseOutlined />) || (<EditIcon />) }
            </span>)
            // return (<span className="task-actions-round edit" onClick={(e) => {doPlayTask(); e.stopPropagation()}}>
            // { task.isCurrentTask && isRunning && (<TimelapseOutlined />) || (<PlayArrow></PlayArrow>) }
            // </span>)
        }
        return (<span></span>);
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
        if(task.epomo) {
            return (<span className={styles["e-pomos"]}><div className={`circle-simple ${styles["completed"]} ${styles["pomo"]}`}> </div> {task.cpomo} / <div className={`circle ${styles["estimated"]} ${styles["pomo"]}`}></div>{ task.epomo }</span>)
        }
        return (<span className={styles["e-pomos"]}><div className={`circle-simple ${styles["completed"]} ${styles["pomo"]}`}> </div> {task.cpomo}</span>)
    })


    return (
    
    <div className={`${styles["task"]} ${isEditable && styles['task-editable']} ${task.isComplete && styles['task-completed']} ${task.isCurrentTask ? styles['selected'] : ''}`} onClick={((e) => props.onClick && props.onClick(task))}>
        <div className={styles['first-row']}>
            <span className={`${styles["checkbox"]} ${task.isComplete && styles['tick']}`} >
                <span onClick={(e) => {toggleMarkAsComplete(e)}} value={!!task.isComplete} defaultChecked={!!task.isComplete} style={{borderColor: priorityColorMap[task.priority]}} />
            </span>
            <span className={styles["task-title"]}>{task.title}</span>
        </div>
        <div className={styles["second-row"]}>
            <span className={styles["estimated-pomos-tag"]}> {getEstimatedPomoHtml()}</span>
            {(task.project.projectID && props.projects && props.projects[task.project.projectID]) && (
                
                <span className={styles["project"]}>
                    <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.4" y="0.4" width="9.2" height="13.2" rx="1.6" stroke="#414141" strokeWidth="0.8"/>
                        <line x1="3" y1="3.6" x2="7" y2="3.6" stroke="#414141" strokeWidth="0.8"/>
                        <line x1="3" y1="6.6" x2="7" y2="6.6" stroke="#414141" strokeWidth="0.8"/>
                        <line x1="3" y1="9.6" x2="7" y2="9.6" stroke="#414141" strokeWidth="0.8"/>
                    </svg>
                    {props.projects[task.project.projectID].title}
                </span>
            )}
            
            <span className={styles["tags"]}>
                {
                    Object.keys(props.tags).length >= task.labels.length && 
                    (
                        task.labels.map((item, ind) => (<span key={ind} className={styles["tags-small"]} style={{borderColor: props.tags[item].color, color: props.tags[item].color}}>#{props.tags[item].title}</span>))
                    )
                }
            </span>
        </div>
        <span className={styles["task-actions"]}>
            {getFirstCTA()}
            <span className={`${styles["task-actions-round"]} ${styles["more"]}`}>
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
                    <div className={styles["more-options"]}>
                        <div className={styles["more-options-item"]} onClick={(e) => {doEditTask(); e.stopPropagation()}}>
                            <EditOutlined></EditOutlined>
                            <span>Edit task</span>
                        </div>
                        <div className={styles["more-options-item"]} onClick={(e) => {doDeleteTask(); e.stopPropagation()}}>
                            <Delete></Delete>
                            <span>Delete task</span>
                        </div>
                    </div>
                </Popover>
            </span>
        </span>

        {task.isCurrentTask && (<div className={styles["selected-tag"]}> Working On</div>)}
    </div>
    );
}