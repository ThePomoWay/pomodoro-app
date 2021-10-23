import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { createTask } from "../../state/slices/TasksSlice";
import EditTaskContainer from "../new-task-modal/EditTaskContainer";

export function AddNewTask() {
    const dispatch = useDispatch();

    let [showBtn, setShowBtn] = useState(true);

    let doSaveTask = useCallback((task) => {
        if(task.fid){
            dispatch(createTask(task));
        }
        setShowBtn(true);
    }, []);
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