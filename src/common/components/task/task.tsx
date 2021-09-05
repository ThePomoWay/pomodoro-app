import React from "react";
import { Task } from "../../models/Task";

export function TaskItem() {
    let task: Task = this.props.task;

    return (
        <div className="task">
            <span>{task.title}</span>
        </div>
    );
}