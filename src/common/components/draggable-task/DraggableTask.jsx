import { Delete, MoreHorizRounded, PlayArrow } from "@material-ui/icons";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Task } from "../../models/Task";
import NaturalDragAnimation from 'natural-drag-animation-rbdnd';

import {Draggable} from "react-beautiful-dnd";

import TaskItem from "../task/task";


export function DraggableTaskItem(props) {
    let task: Task = props.task;
    
    if(!task) {
        return (<div></div>);
    }

    return (
        <Draggable draggableId={props.dropId + task.fid} index={props.index}>
            {(provided, snapshot) => {
                return (
                    <NaturalDragAnimation
                        style={provided.draggableProps.style}
                        snapshot={snapshot}>
                            {style => (<div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={style}
                    ref={provided.innerRef}
                    >
                            <TaskItem 
                                showAddBtn={props.showAddBtn} 
                                showRemoveBtn={props.showRemoveBtn} 
                                doRemoveTask={props.doRemoveTask}
                                doAddTask={props.doAddTask}
                                task={task} 
                                onClick={props.onClick}
                                tags={props.tags}
                                >
                            </TaskItem>
                        </div>)}
                    
                        </NaturalDragAnimation>
                );
            }}
        
        </Draggable>

    );
}