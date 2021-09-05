import React from "react";
import { useDispatch } from "react-redux";
import { showTaskModal } from "../../state/slices/GlobalSlice";

export function AddNewTask() {
    const dispatch = useDispatch();
    return (
        <button className="btn btn-simple" onClick={() => dispatch(showTaskModal()) }>
            + Add New Task
        </button>
    );
}