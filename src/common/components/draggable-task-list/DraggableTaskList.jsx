import React, { useCallback } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { selectEditTask, selectTagsAsObj } from "../../state/selectors";
import { setEditTask, updateTaskThunk } from "../../state/slices/TasksSlice";
import { DraggableTaskItem } from "../draggable-task/DraggableTask";
import EditTaskContainer from "../new-task-modal/EditTaskContainer";

import styles from "./draggableList.module.scss";

export default (props) => {
    
    let editableTask = useSelector(selectEditTask);
    let tags = useSelector(selectTagsAsObj);

    let dispatch = useDispatch();


    let doSaveTask = useCallback((item) => {
        if(item && item.fid) {
            dispatch(updateTaskThunk(item));
        }
        dispatch(setEditTask(''));
    })

    let doSetEditTask = useCallback((item) => {
        dispatch(setEditTask(item.fid));
    })
    
    return (
            <Droppable droppableId={props.dropId}>
            {(provided) => {
                return (
                <div className={styles['task-container']}>
                    <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}>
                        {props.tasks.map((item, index) => {
                            if(!item) {
                                return (<div></div>);
                            }
                            if(props.isEditable && editableTask && editableTask.fid === item.fid){
                                return (
                                    <EditTaskContainer key={item.fid} task={item} saveTask={doSaveTask} />
                                )
                            }
                            return (
                            <DraggableTaskItem tags={tags} task={item} key={item.fid} index={index} dropId={props.dropId} onClick={doSetEditTask}/>
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