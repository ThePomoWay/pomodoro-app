import React, { useCallback } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { selectEditTask, selectTagsAsArr, selectTagsAsObj } from "../../state/selectors";
import { addToTodaysTasks, markTaskAsCompleteThunk, markTaskAsInCompleteThunk, removeFromTodaysTasks, setEditTask, updateTaskThunk } from "../../state/slices/TasksSlice";
import { DraggableTaskItem } from "../draggable-task/DraggableTask";
import EditTaskContainer from "../new-task-modal/EditTaskContainer";

import styles from "./plannerDraggableList.module.scss";

export default (props) => {
    let dispatch = useDispatch();
    let editableTask = useSelector(selectEditTask);

    let doSaveTask = useCallback((item) => {
        if(item && item.fid) {
            dispatch(updateTaskThunk(item));
        }
        dispatch(setEditTask(''));
    })

    let tags = useSelector(selectTagsAsObj);

    const doAddTask = useCallback((task) => {
        dispatch(addToTodaysTasks({fid: task.fid}));
    });

    const doRemoveTask = useCallback((task) => {
        dispatch(removeFromTodaysTasks({
            fid: task.fid
        }));
    });

    const doSetEditTask = useCallback((item) => {
        dispatch(setEditTask(item.fid));
    })

    const doCompleteTask = useCallback((task) => {
        if(!task.isComplete) {
            dispatch(markTaskAsCompleteThunk({task, container: props.container}));
        }
        else {
            dispatch(markTaskAsInCompleteThunk({task, container: props.container}));
        }
    });
    
    return (
            <Droppable droppableId={props.dropId} type="Planner">
            {(provided) => {
                return (
                <div className={styles['task-container']}>
                    <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}>
                        {props.tasks.map((item, index) => {
                            if(props.isEditable && editableTask && editableTask.fid === item.fid){
                                return (
                                    <EditTaskContainer key={item.fid} task={item} saveTask={doSaveTask} />
                                )
                            }
                            return (
                                <DraggableTaskItem 
                                showAddBtn={!(item.fid in props.todaysTasksIds)} 
                                showRemoveBtn={(item.fid in props.todaysTasksIds)} 
                                doAddTask={doAddTask}
                                doRemoveTask={doRemoveTask}
                                onComplete={doCompleteTask}
                                tags={tags}
                                task={item} 
                                key={item.fid} 
                                onClick={doSetEditTask}
                                index={index} 
                                dropId={props.dropId} />
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