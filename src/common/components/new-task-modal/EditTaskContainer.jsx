import { Flag, TagFaces } from "@material-ui/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { generateUniqueId } from "../../utils/common";
import EstimatedPomos from "../estimate-pomos/EstimatedPomos";

import styles from "./EditTaskContainer.module.scss";

export default function EditTaskContainer(props) {
    let taskToBeEdited = props.task || {};

    let ref = useRef(null);

    useEffect(() => {
        if(ref) {
            ref.current.focus();
        }
    }, [ref]);

    let [showTitleInput, setShowTitleInput] = useState(true);
    let [title, setTitle]                   = useState(taskToBeEdited.title || '');
    let [priority, setPriority]             = useState(taskToBeEdited.priority || 2);
    let [description, setDescription]       = useState(taskToBeEdited.description || '');
    let [schedule, setSchedule]             = useState(taskToBeEdited.schedule || new Date());
    let [estimatedPomos, setEstimatedPomos] = useState(taskToBeEdited.estimatedPomos || 0);

    if(taskToBeEdited.fid) {
        setTitle(taskToBeEdited.title);
        setPriority(taskToBeEdited.priority);
        setDescription(taskToBeEdited.description);
        setSchedule(taskToBeEdited.schedule);
    }

    let doSaveTask = useCallback(() => {
        let task = {
            fid: taskToBeEdited.fid || generateUniqueId(),
            title,
            priority,
            description,
            schedule: schedule.toString(),
            estimatedPomos,
            summary: {
                csec: 0
            },
            project: {
                projectID: '',
                secID: ''
            }
        }

        props.saveTask(task);

        // setTitle('');
        // setPriority(2);
        // setDescription('');
        // setShowTitleInput(true);

    });

    let doCancelTask = useCallback(() => {
        props.saveTask({});
    }, []);

    let _handleKeyDown = (e) => {
        if (e.key === 'Enter' && title) {
            doSaveTask();
        }
    }

    return (
        <div>
        <div className={styles['edit-task']}>
            <div ref={ref} className={styles['content-editable-div']} contentEditable="true" onInput={(e) => {setTitle(e.currentTarget.textContent)}}>

            </div>
            <div className={styles['cta-row']}>
                <div className={styles['estimated-pomos']}>
                    <span className={styles['estimated-pomos-text']}>Estd. Pomo: </span>
                    <div className={styles['estimated-pomos-container']}>
                        <EstimatedPomos default="5" onClick={(value) => {setEstimatedPomos(value)}}/>
                    </div>
                </div>
                <div className="right-cta">
                    <TagFaces />
                    <Flag />
                </div>
            </div>
        </div>
        <div className={styles['save-cta']}>
            <button className="btn btn-simple" onClick={() => {doSaveTask()}}>Save</button>
            <button className="btn btn-simple btn-simple-light" onClick={() => {doCancelTask()}}>Cancel</button>
        </div>
    </div>)
}