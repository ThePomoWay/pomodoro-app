import DateFnsUtils from "@date-io/date-fns";
import { Flag } from "@material-ui/icons";
import { DatePicker, DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectModalState, selectTasks, selectTaskToBeEdited } from "../../state/selectors";
import { hideTaskModal } from "../../state/slices/GlobalSlice";
import { createTask, updateTask } from "../../state/slices/TasksSlice";
import { generateUniqueId } from "../../utils/common";
import { priorityColorMap } from "../../utils/constants";

import "./NewTaskModal.scss";

export default function AddNewTaskModal(props) {

    let showModal = useSelector(selectModalState);
    let tasks = useSelector(selectTasks);
    let taskToBeEdited = useSelector(selectTaskToBeEdited);

    let dispatch = useDispatch();

    let [showTitleInput, setShowTitleInput] = useState(true);
    let [title, setTitle]                   = useState(taskToBeEdited.title || '');
    let [priority, setPriority]             = useState(taskToBeEdited.priority || 2);
    let [description, setDescription]       = useState(taskToBeEdited.description || '');
    let [schedule, setSchedule]             = useState(taskToBeEdited.schedule || new Date());

    useEffect(() => {
        if(taskToBeEdited.id) {
            setTitle(taskToBeEdited.title);
            setPriority(taskToBeEdited.priority);
            setDescription(taskToBeEdited.description);
            setSchedule(taskToBeEdited.schedule);
        }
    }, [taskToBeEdited])

    let doSaveTask = () => {
        let task = {
            id: taskToBeEdited.id || generateUniqueId(),
            title,
            priority,
            description,
            schedule
        }

        if(!tasks || !tasks.length) {
            task.isCurrentTask = true;
        }

        if(taskToBeEdited.id){
            dispatch(updateTask(task));
        }
        else {
            dispatch(createTask(task));
        }
        dispatch(hideTaskModal());

        setTitle('');
        setPriority(2);
        setDescription('');
        setShowTitleInput(true);

    }

    let _handleKeyDown = (e) => {
        if (e.key === 'Enter' && title) {
            setShowTitleInput(true);
        }
    }

    console.log('title, ', title);

    return (
    <div className={`modal ${showModal ? 'show' : ''}`}>
        <div className="modal-content">
            {/* <div className="modal-close" onClick={() => dispatch(hideTaskModal())}>
                <Close></Close>
            </div> */}

            <div className="grid new-task-container">
                <div className="new-task-title">
                    {showTitleInput ? (<span className="title" onClick={() => setShowTitleInput(false)}>{title || 'Add New Title'}</span>):
                    (<input autoFocus className="title-input" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={_handleKeyDown}/>)}
                    <span className="priority">Select Priority: 
                        <li className="dropdown">{'P' + priority}<Flag className={`icon-${priorityColorMap[priority]}`}></Flag>
                            <ul className="dropdown-menu">
                                {[1,2,3,4].map(item => (<li key={item} onClick={() => {setPriority(item)}} className="dropdown-item">{'P' + item}<Flag className={`icon-${priorityColorMap[item]}`}></Flag></li>))}
                            </ul>
                        </li>
                    </span> 
                </div>
                <div className="labels">
                    <button className="btn btn-simple btn-small">+ Add Tags</button>
                </div>
                <div className="new-task-description">
                    <textarea placeholder="description"></textarea>
                </div>
                <div className="grid grid-column">
                    <div className="est-pomo-picker">
                        <span className="label">Your Estimated Pomodoros</span>
                        <span className="round"></span>
                        <span className="round"></span>
                        <span className="round"></span>
                        <span className="round"></span>
                        <span className="round"></span>
                        <span>+</span>
                    </div>

                    <span className="date-time-picker">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DateTimePicker
                                label="Set Schedule"
                                inputVariant="outlined"
                                value={schedule} 
                                onChange={setSchedule}
                                showTodayButton/>
                        </MuiPickersUtilsProvider>
                    </span>
                </div>

                <div className="new-task-cta">
                    <span className="underline" onClick={() => dispatch(hideTaskModal())}>Discard</span>
                    <button className="btn btn-simple" onClick={(e) => doSaveTask()}>Save Task</button>
                </div>
            </div>
        </div>
        <div className="modal-backdrop"></div>
    </div>)
}