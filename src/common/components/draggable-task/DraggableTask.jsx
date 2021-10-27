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
                return (
                    <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    >
                            <TaskItem 
                                showAddBtn={props.showAddBtn} 
                                showRemoveBtn={props.showRemoveBtn} 
                                doRemoveTask={props.doRemoveTask}
                                doAddTask={props.doAddTask}
                                task={task} 
                                onClick={props.onClick}>
                            </TaskItem>
                        </div>
                );
            }}
        
        </Draggable>

    );
}