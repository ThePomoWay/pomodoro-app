import { Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core"
import { ExpandMoreOutlined, Menu, MenuBookOutlined } from "@material-ui/icons"
import { useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectTagsAsObj, selectTasksAsobj, selectTodaysTaskIds } from "../../state/selectors"
import { SECTION_DROPPABLE_ID } from "../../utils/droppable-ids"
import {Droppable, Draggable} from "react-beautiful-dnd";
import { DraggableTaskItem } from "../draggable-task/DraggableTask"
import EditTaskContainer from "../new-task-modal/EditTaskContainer"

import styles from "./Section.module.scss"
import { getObjFromArr } from "../../utils/common"
import CompletedTasksList from "../completed-tasks-collapsible/CompletedTasksList"
import { markTaskAsCompleteThunk, markTaskAsInCompleteThunk } from "../../state/slices/TasksSlice"

export default (props) => {
    let tasks = useSelector(selectTasksAsobj);
    let tags = useSelector(selectTagsAsObj);
    let todaysTaskIdsObj = getObjFromArr(useSelector(selectTodaysTaskIds));

    let dispatch = useDispatch();

    let [showEditTaskContainer, setShowEditTaskContainer] = useState(false);
    let [expanded, setExpanded] = useState(!!props.defaultExpanded);

    const addTaskToSection = useCallback((task) => {
        props.onAddTask && props.onAddTask(task, props.section);
        setShowEditTaskContainer(false);
    })

    const doCompleteTask = useCallback((task) => {
        if(!task.isComplete) {
            dispatch(markTaskAsCompleteThunk({task, container: 'projects', projectId: props.projectId, sectionId: props.section.fid}))
        }
        else {
            dispatch(markTaskAsInCompleteThunk({task, container: 'projects', projectId: props.projectId, sectionId: props.section.fid}))
        }
    });

    if(props.section && Object.keys(tasks).length > 0) {
        let section = props.section;

        return (
        <div className={`${styles['section']}`}>
            
                        <Accordion
                        elevation={0}
                        onChange={(e) => setExpanded(!expanded)}
                        expanded={(props.open) || (!props.isDragging && expanded)}
                        >
                            <AccordionSummary
                            expandIcon={<ExpandMoreOutlined />}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                                <div className={styles['section-title']}>
                                <span  {...props.dragHandleProps} className={styles['hamburger']}> <Menu/> </span>
                                <h2>{section.title}</h2>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className={styles["section-task-list"]}>
                                <Droppable droppableId={SECTION_DROPPABLE_ID+section.fid} type="task">
                                    {
                                        (provided) => (
                                            <div
                                            
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            >
                                                {props.section.taskOrder.map((item, index) => (
                                                    <DraggableTaskItem
                                                        showAddBtn={!(item in todaysTaskIdsObj)} 
                                                        showRemoveBtn={(item in todaysTaskIdsObj)}
                                                        tags={tags}
                                                        task={tasks[item]}
                                                        key={item}
                                                        index={index}
                                                        dropId={'task-'}
                                                        doAddTask={props.doAddTask}
                                                        onComplete={doCompleteTask}
                                                        doRemoveTask={props.doRemoveTask}>

                                                    </DraggableTaskItem>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )
                                    }
                                
                                </Droppable>

                                {!showEditTaskContainer && 
                                    (<button className="btn btn-simple" onClick={(e) => setShowEditTaskContainer(true)}>+ Create new Task</button>)
                                    ||
                                    (<EditTaskContainer defaultProjectId={props.projectId} task={{}} saveTask={addTaskToSection} />)
                                }
                                 {section.completedTaskOrder && (
                                    <CompletedTasksList tasks={section.completedTaskOrder.map(item => tasks[item])} projectId={props.projectId} sectionId={props.section.fid} container='projects' />
                                )}
                                </div>

                               
                                
                            </AccordionDetails>
                    </Accordion>
                    
        </div>
        )
    }

    return (<div>Loading...</div>)
}