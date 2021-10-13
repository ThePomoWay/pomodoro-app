import { current } from "@reduxjs/toolkit";
import React from "react"
import { useSelector } from "react-redux"
import { selectCurrentTask } from "../../state/selectors"
import { TaskItem } from "../task/task";

export default function CurrentTask () {
    let currentTask = useSelector(selectCurrentTask);
    if(!currentTask.title) {
        return (
            <div></div>
        );
    }
    return (
        <div>
            <p>Currently working on</p>
            <TaskItem task={currentTask}/>
        </div>
    );
}