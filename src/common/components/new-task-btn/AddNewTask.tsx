import { Add } from "@material-ui/icons";
import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { createTaskThunk } from "../../state/slices/TasksSlice";
import EditTaskContainer from "../new-task-modal/EditTaskContainer";

import styles from "./AddNewTask.module.scss";

export function AddNewTask(props) {
    const dispatch = useDispatch();

    let [showBtn, setShowBtn] = useState(true);

    let doSaveTask = (task) => {
        if(task.fid){
            dispatch(createTaskThunk({
                task,
                isTodaysTask: props.isTodaysTask
            }));
            props.onSave && props.onSave(task);
        }
        else {
            setShowBtn(true);
        }
    };
    
        if(showBtn) {
            return (
                <button className={`btn btn-simple ${styles['add-task-btn']}`} onClick={() => setShowBtn(!showBtn) }>
                    <Add style={{width: '16px' , height: '16px'}}/> CREATE TASK
                </button>
            );
        }
        return (
            <EditTaskContainer saveTask={doSaveTask}/>
        );
    
}