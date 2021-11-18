import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { createTaskThunk } from "../../state/slices/TasksSlice";
import EditTaskContainer from "../new-task-modal/EditTaskContainer";

export function AddNewTask(props) {
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
                <button className="btn btn-simple" onClick={() => setShowBtn(!showBtn) }>
                    + Add New Task
                </button>
            );
        }
        return (
            <EditTaskContainer task={{}} saveTask={doSaveTask}/>
        );
    }, [showBtn]);

    return showEditContainer();
}