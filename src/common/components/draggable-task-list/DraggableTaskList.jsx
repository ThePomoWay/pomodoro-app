import React, { useCallback } from "react";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { Task } from "../../models/Task";
import { rearrangeAllTasks, rearrangeTodaysTask } from "../../state/slices/TasksSlice";
import { todaysTasksDropId } from "../../utils/constants";
import { DraggableTaskItem } from "../draggable-task/DraggableTask";

import styles from "./draggableList.module.scss";

export default (props) => {
    let dispatch = useDispatch();
    

    return (
            <Droppable droppableId={props.dropId}>
            {(provided) => {
                return (
                <div className={styles['task-container']}>
                    <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}>
                        {props.tasks.map((item, index) => <DraggableTaskItem task={item} key={item.fid} index={index} dropId={props.dropId}/>)}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        }
            
                
                    
                            
                
            
            </Droppable>
    );
}