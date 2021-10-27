import React, { useCallback } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { addToTodaysTasks, removeFromTodaysTasks } from "../../state/slices/TasksSlice";
import { DraggableTaskItem } from "../draggable-task/DraggableTask";

import styles from "./plannerDraggableList.module.scss";

export default (props) => {
    let dispatch = useDispatch();

    const doAddTask = useCallback((task) => {
        dispatch(addToTodaysTasks({fid: task.fid}));
    });

    const doRemoveTask = useCallback((task) => {
        dispatch(removeFromTodaysTasks({
            fid: task.fid
        }));
    });
    
    return (
            <Droppable droppableId={props.dropId}>
            {(provided) => {
                return (
                <div className={styles['task-container']}>
                    <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}>
                        {props.tasks.map((item, index) => {
                            return (
                                <DraggableTaskItem 
                                showAddBtn={!(item.fid in props.todaysTasksIds)} 
                                showRemoveBtn={(item.fid in props.todaysTasksIds)} 
                                doAddTask={doAddTask}
                                doRemoveTask={doRemoveTask}
                                task={item} key={item.fid} index={index} dropId={props.dropId} />
                            )
                        }
                        )}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        }
            </Droppable>
    );
}