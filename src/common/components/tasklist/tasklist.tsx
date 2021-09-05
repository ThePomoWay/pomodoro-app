import React from "react";
import { useSelector } from "react-redux";
import { selectTasks } from "../../state/selectors";
import { AddNewTask } from "../new-task-btn/AddNewTask";
import { TaskItem } from "../task/task";

import "./tasklist.scss";

function getTasks(tasks) {
    if(!tasks || tasks.length === 0) {
        return (
            <div className="empty-state">
                <span className="title">Morning! Start your day and accomplish your goals for the day</span>
                <span className="label">Add new tasks to the list and start your pomodoro !</span>
                <img src="/empty-tasks.png" />
                <AddNewTask></AddNewTask>
            </div>
        );
    }
    return (
    <div className="tasks">
        {tasks.map((item, ind) => {
            let TaskProps = {
                key: ind,
                task: item
            }
            return (<TaskItem {...TaskProps}></TaskItem>) }) }
    </div>);
}

export function TaskList () {
    let tasks = useSelector(selectTasks);
    return getTasks(tasks);
}