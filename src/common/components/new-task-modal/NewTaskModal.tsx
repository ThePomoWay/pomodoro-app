import { Close, Flag } from "@material-ui/icons";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectModalState } from "../../state/selectors";
import { hideTaskModal } from "../../state/slices/GlobalSlice";

import "./NewTaskModal.scss";

export default function AddNewTaskModal() {
    let showModal = useSelector(selectModalState);
    let dispatch = useDispatch();

    return (
    <div className={`modal ${showModal ? 'show' : ''}`}>
        <div className="modal-content">
            {/* <div className="modal-close" onClick={() => dispatch(hideTaskModal())}>
                <Close></Close>
            </div> */}

            <div className="grid new-task-container">
                <div className="new-task-title">
                    <span className="title">Add New Task</span>
                    <span className="priority">Select priority <Flag></Flag></span> 
                </div>
                <div className="labels">
                    <button className="btn btn-simple btn-small">+ Add Tags</button>
                    <span>Schedule: today</span>
                </div>
                <div className="new-task-description">
                    <textarea placeholder="description"></textarea>
                </div>
                <div className="estimated-pomos">
                    <span className="label">Your Estimated Pomodoros</span>
                    <span className="round"></span>
                    <span className="round"></span>
                    <span className="round"></span>
                    <span className="round"></span>
                    <span className="round"></span>
                    <span>+</span>
                </div>

                <div className="new-task-cta">
                    <span className="underline" onClick={() => dispatch(hideTaskModal())}>Discard</span>
                    <button className="btn btn-simple">Save Task</button>
                </div>
            </div>
        </div>
        <div className="modal-backdrop"></div>
    </div>)
}