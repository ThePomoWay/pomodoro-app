import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { DraggableTaskItem } from "../draggable-task/DraggableTask";

import styles from "./plannerDraggableList.module.scss";

export default (props) => {
    
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
                            <DraggableTaskItem shoAddBtn={true} task={item} key={item.fid} index={index} dropId={props.dropId} onClick={doSetEditTask}/>
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