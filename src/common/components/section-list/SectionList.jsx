import { useCallback } from "react"
import AddNewSection from "../add-new-section/AddNewSection"
import Section from "../section/Section"

import {Droppable, Draggable} from "react-beautiful-dnd";

import styles from "./SectionList.module.scss";

export default (props) => {

    const onCreateSection = useCallback((section) => props.onCreateSection && props.onCreateSection(section))
    const onAddTask = useCallback((task, section) => props.onAddTaskToSection && props.onAddTaskToSection(task, section))
    return (
        <div>
          
                    <AddNewSection
                        showOnHover={props.order.length > 0}
                        onSave={onCreateSection}
                        index={0}
                    ></AddNewSection>
            
            
            
            <Droppable droppableId="id-section" type="section">
                {(provided, snapshot) => (
                    <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}>
                        {props.order && props.sections && 
                            props.order.map((item, index) => (

                                <Draggable key={props.sections[item].fid} draggableId={props.sections[item].fid} index={index}>
                {
                    (provided) => (
                        <div
                        className={styles["section"]}
                        
                        {...provided.draggableProps}
                        ref={provided.innerRef}>
                                    <Section
                                        open={props.isTaskDragging}
                                        section={props.sections[item]}
                                        onAddTask={onAddTask}
                                        index={index}
                                        projectId={props.projectId}
                                        isDragging={props.isDragging}
                                        doAddTask={props.doAddTask}
                                        doRemoveTask={props.doRemoveTask}
                                        defaultExpanded={props.defaultExpandedSectionId === props.sections[item].fid}
                                        dragHandleProps={provided.dragHandleProps}
                                        />
                                        
                                        <AddNewSection
                                            showOnHover={true}
                                            onSave={onCreateSection}
                                            index={index+1}
                                        ></AddNewSection>
                                        
                                    
                                </div>
                    )
                }
            
            </Draggable>
                                ))
                        }
                    {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}