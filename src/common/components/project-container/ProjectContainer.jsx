
import { useDispatch, useSelector } from "react-redux";
import { selectAllTasks, selectProjectsObj, selectTagsAsObj, selectTasksAsobj, selectTodaysTaskIds } from "../../state/selectors";

import {useParams} from 'react-router-dom';
import { useCallback, useState } from "react";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import { DraggableTaskItem } from "../draggable-task/DraggableTask";
import DraggableTaskList from "../draggable-task-list/DraggableTaskList";
import EditTaskContainer from "../new-task-modal/EditTaskContainer";
import SectionList from "../section-list/SectionList";
import { updateProject, updateProjectAsync } from "../../state/slices/ProjectSlice";
import { addToTodaysTasks, createTaskThunk, markTaskAsCompleteThunk, markTaskAsInCompleteThunk, removeFromTodaysTasks } from "../../state/slices/TasksSlice";
import { PROJECT_DROPPABLE_ID } from "../../utils/droppable-ids";

import styles from "./ProjectContainer.module.scss";
import { getObjFromArr } from "../../utils/common";
import CompletedTasksList from "../completed-tasks-collapsible/CompletedTasksList";

export default () => {
    let {projectId} = useParams();
    
    let projectsObj = useSelector(selectProjectsObj);
    let tags = useSelector(selectTagsAsObj);
    let todaysTaskIds = useSelector(selectTodaysTaskIds);
    let todaysTaskIdsObj = getObjFromArr(todaysTaskIds);

    let dispatch = useDispatch();

    let tasks = useSelector(selectTasksAsobj);

    let [showEditTaskContainer, setShowEditTaskContainer] = useState(false);
    let [isDragging, setIsDragging] = useState(false);
    let [isTaskDragging, setIsTaskDragging] = useState(false);
    let [showCompletedSection, setShowCompletedSection] = useState(false);
    let [editableTaskNo, setEditableTaskNo] = useState();

    let [defaultExpandedSectionId, setDefaultExpandedSectionId] = useState('')

    let project = projectsObj[projectId];

    const doEditTask = useCallback((index) => {
        return function(task) {
            setEditableTaskNo(index)
        }
    })

    const addTaskToProject = useCallback((task) => {
        if(task.fid){
            dispatch(createTaskThunk({task}));
            dispatch(updateProjectAsync({
                ...project,
                taskOrder: [...project.taskOrder, task.fid]
            }))
        }
        else{
        setShowEditTaskContainer(false);
        }
    });

    const onSectionCreate = useCallback((section) => {
        let sectionOrderCopy = JSON.parse(JSON.stringify(project.sectionOrder));
        sectionOrderCopy.splice(section.index, 0, section.fid);

        dispatch(updateProjectAsync({
            ...project,
            sections: {
                ...project.sections,
                [section.fid]: {
                    fid: section.fid,
                    title: section.title,
                    taskOrder: section.taskOrder,
                    completedTaskOrder: section.completedTaskOrder
                }
                
            },
            sectionOrder: sectionOrderCopy
        }))
    });

    const onAddTaskToSection = useCallback((task, section) => {
        dispatch(createTaskThunk({task}));
        dispatch(updateProjectAsync({
            ...project,
            sections: {
                ...project.sections,
                [section.fid]: {
                    ...section,
                    taskOrder: [...section.taskOrder, task.fid]
                }
            }
        }))
    });

    const onDragEnd = useCallback((result) => {
        if(result.source && result.destination){
            if(result.type === 'section') {
                let sectionOrderCopy = JSON.parse(JSON.stringify(project.sectionOrder));

                let sid = sectionOrderCopy.splice(result.source.index, 1);
                sectionOrderCopy.splice(result.destination.index, 0, sid);

                dispatch(updateProjectAsync({
                    ...project,
                    sectionOrder: sectionOrderCopy
                }))
            }
            else {
                
                let projectCopy = JSON.parse(JSON.stringify(project))

                if(result.source.droppableId === PROJECT_DROPPABLE_ID) {
                    projectCopy.taskOrder.splice(result.source.index, 1);
                }
                else {
                    let sectionId = result.source.droppableId.split('section-droppable-')[1];
                    if(projectCopy.sections[sectionId]) {
                        projectCopy.sections[sectionId].taskOrder.splice(result.source.index, 1)
                    }
                }

                let taskId = result.draggableId.split('task-')[1]
                if(result.destination.droppableId === PROJECT_DROPPABLE_ID) {
                    projectCopy.taskOrder.splice(result.destination.index, 0, taskId);
                }
                else {
                    let sectionId = result.destination.droppableId.split('section-droppable-')[1];
                    if(projectCopy.sections[sectionId]) {
                        projectCopy.sections[sectionId].taskOrder.splice(result.destination.index, 0, taskId)
                    }
                    setDefaultExpandedSectionId(sectionId);
                }

                dispatch(updateProjectAsync(projectCopy))
            }
        }

        setIsDragging(false);
        setIsTaskDragging(false);
    });

    const onBeforeDragStart = useCallback((res) => {
        if(!res.draggableId.startsWith('task-')){
            setIsDragging(true);
        }
        else {
            setIsTaskDragging(true);
        }
    });

    const doAddTask = useCallback((task) => {
        dispatch(addToTodaysTasks({fid: task.fid}));
    });

    const doRemoveTask = useCallback((task) => {
        dispatch(removeFromTodaysTasks({
            fid: task.fid
        }));
    });

    const doCompleteTask = useCallback((task) => {
        if(!task.isComplete) {
            dispatch(markTaskAsCompleteThunk({task, container: 'projects', projectId: project.fid}))
        }
        else {
            dispatch(markTaskAsInCompleteThunk({task, container: 'projects', projectId: project.fid}))
        }
    });
    

    if(project) {

        let totalTasks = project.taskOrder.length;
        for(let sectionId of project.sectionOrder) {
            totalTasks += project.sections[sectionId].taskOrder.length;
        }
        
        return (
            <div className={styles['project-container']}>
                <div className={styles['title']}>
                    <span>{project.title}</span>
                </div>
                <DragDropContext
                    onBeforeCapture={onBeforeDragStart}
                    onDragEnd={onDragEnd}>
                    <div className={styles["mar-b20"]}>
                    <Droppable droppableId={PROJECT_DROPPABLE_ID} type="task">
                        {
                            (provided) => (
                                <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                >
                                    {
                                    totalTasks > 0 && 
                                        (
                                        <div className={styles["task-list"]}>
                                            {project.taskOrder.map((item, index) => 
                                                (
                                                
                                                <DraggableTaskItem
                                                    showAddBtn={!(item in todaysTaskIdsObj)} 
                                                    showRemoveBtn={(item in todaysTaskIdsObj)}
                                                    doAddTask={doAddTask}
                                                    doRemoveTask={doRemoveTask} 
                                                    tags={tags} 
                                                    task={tasks[item]} 
                                                    key={item}
                                                    index={index} 
                                                    onComplete={doCompleteTask}
                                                    onClick={doEditTask(index)}
                                                    dropId={'task-'}></DraggableTaskItem>
                                                ))}
                                        </div>
                                        )
                                    }
                                    {provided.placeholder}
                                </div>
                                
                            )
                        }
                    </Droppable>
                    
                <div className={styles['create-task']}>
                {
                    !showEditTaskContainer && 
                    (<button className="btn btn-simple" onClick={(e) => setShowEditTaskContainer(true)}>+ Create a task</button>)
                    ||
                    (<EditTaskContainer defaultProjectId={project.fid} task={{}} saveTask={addTaskToProject} />)
                }
                </div>

                <div className={styles['completed-task']}>
                    <CompletedTasksList container='projects' projectId={project.fid} tasks={project.completedTaskOrder.map(item => tasks[item])}/>
                </div>
                </div>
                {
                    (<SectionList 
                        order={project.sectionOrder} 
                        sections={project.sections}
                        onCreateSection={onSectionCreate}
                        onAddTaskToSection={onAddTaskToSection}
                        isDragging={isDragging}
                        doAddTask={doAddTask}
                        doRemoveTask={doRemoveTask}
                        isTaskDragging={isTaskDragging}
                        projectId={project.fid}
                        defaultExpandedSectionId={defaultExpandedSectionId}
                         />)
                    ||
                    (
                        <div className="flex flex-center">
                            <img src="/project-empty.jpg" />
                            <span className="text-small text-gray">Create Sections to organize your tasks </span>
                        </div>
                    )
                }
                </DragDropContext>
            </div>
        );
    }
    return (
        <div className={styles['project-container']}>
            <span>Loading...</span>
        </div>
    )
}