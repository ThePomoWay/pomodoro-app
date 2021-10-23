import { Delete, MoreHorizRounded, PlayArrow } from "@material-ui/icons";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Task } from "../../models/Task";
import { editTask } from "../../state/slices/GlobalSlice";
import { deleteTaskThunk, markTaskAsCurrent } from "../../state/slices/TasksSlice";
import { initiatePomo } from "../../state/slices/TimerSlice";

import {Draggable} from "react-beautiful-dnd";

import TaskItem from "../task/task";


export function DraggableTaskItem(props) {
    let task: Task = props.task;

    return (
        <Draggable draggableId={props.dropId + task.fid} index={props.index}>
            {(provided, snapshot) => {
                let inner = {ref: provided.innerRef};
                return (
                    <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    >
                        
                            <TaskItem task={task}></TaskItem>
                        </div>
                );
            }}
        
        </Draggable>

    );
}