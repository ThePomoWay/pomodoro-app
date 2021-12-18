import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { createTaskThunk } from "../../state/slices/TasksSlice";
import EditTaskContainer from "../new-task-modal/EditTaskContainer";

import styles from "./AddNewTask.module.scss";

export const AddNewTask = React.memo(function(props) {
    const dispatch = useDispatch();

    let [showBtn, setShowBtn] = useState(true);

    let doSaveTask = useCallback((task) => {
        if(task.fid){
            dispatch(createTaskThunk({
                task,
                isTodaysTask: props.isTodaysTask
            }));
        }
        else {
            setShowBtn(true);
        }
    }, [props]);
    let showEditContainer = useCallback(() => {
        if(showBtn) {
            return (
                <button className={`btn btn-simple ${styles['add-task-btn']}`} onClick={() => setShowBtn(!showBtn) }>
                    + Create task
                </button>
            );
        }
        return (
            <EditTaskContainer saveTask={doSaveTask}/>
        );
    }, [showBtn]);

    return showEditContainer();
})