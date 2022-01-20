
import { useDispatch, useSelector } from "react-redux";
import { selectAllTasks, selectCompletedTaskInProject, selectProjectsObj, selectTagsAsObj, selectTasksAsobj, selectTodaysTaskIds } from "../../state/selectors";

import {useParams} from 'react-router-dom';
import { useCallback, useState } from "react";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import { DraggableTaskItem } from "../draggable-task/DraggableTask";
import DraggableTaskList from "../draggable-task-list/DraggableTaskList";
import EditTaskContainer from "../new-task-modal/EditTaskContainer";
import SectionList from "../section-list/SectionList";
import { createSectionAsync, rearrangeTaskInProjectAsync, updateProject, updateProjectAsync } from "../../state/slices/ProjectSlice";
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
    let completedTasks = useSelector(selectCompletedTaskInProject(projectsObj[projectId] && projectsObj[projectId]._id, ''));
    

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
                to: [...project.to, task.fid]
            }))
        }
        else{
        setShowEditTaskContainer(false);
        }
    });

    const onSectionCreate = useCallback((section) => {
        dispatch(createSectionAsync({project, section}))
    });

    const onAddTaskToSection = useCallback((task, section) => {
        dispatch(createTaskThunk({task}));
        dispatch(updateProjectAsync({
            ...project,
            sections: {
                ...project.sections,
                [section.fid]: {
                    ...section,
                    to: [...section.to, task.fid]
                }
            }
        }))
    });

    const onDragEnd = useCallback((result) => {
        if(result.source && result.destination){
            if(result.type === 'section') {
                let sectionOrderCopy = JSON.parse(JSON.stringify(project.so));

                let sid = sectionOrderCopy.splice(result.source.index, 1);
                sectionOrderCopy.splice(result.destination.index, 0, sid);

                dispatch(updateProjectAsync({
                    ...project,
                    so: sectionOrderCopy
                }))
            }
            else {
                
                let projectCopy = JSON.parse(JSON.stringify(project))

                let source = {
                    isSection: false,
                    hid: '',
                    to: []
                };
                let destination = {
                    isSection: false,
                    hid: '',
                    to: []
                };

                if(result.source.droppableId === PROJECT_DROPPABLE_ID) {
                    projectCopy.to.splice(result.source.index, 1);
                    source.hid = projectCopy._id;
                    source.to = projectCopy.to;
                }
                else {
                    let sectionId = result.source.droppableId.split('section-droppable-')[1];
                    if(projectCopy.sections[sectionId]) {
                        projectCopy.sections[sectionId].to.splice(result.source.index, 1)

                        source.isSection = true;
                        source.hid = projectCopy.sections[sectionId]._id;
                        source.to = projectCopy.sections[sectionId].to
                    }
                }

                let taskId = result.draggableId.split('task-')[1]
                if(result.destination.droppableId === PROJECT_DROPPABLE_ID) {
                    projectCopy.to.splice(result.destination.index, 0, taskId);

                    destination.hid = projectCopy._id;
                    destination.to = projectCopy.to;
                }
                else {
                    let sectionId = result.destination.droppableId.split('section-droppable-')[1];
                    if(projectCopy.sections[sectionId]) {
                        projectCopy.sections[sectionId].to.splice(result.destination.index, 0, taskId)

                        destination.isSection = true;
                        destination.hid = projectCopy.sections[sectionId]._id;
                        destination.to = projectCopy.sections[sectionId].to;
                    }
                    setDefaultExpandedSectionId(sectionId);
                }

                source.to = source.to.map(item => tasks[item] && tasks[item]._id);
                destination.to = destination.to.map(item => tasks[item] && tasks[item]._id);

                dispatch(rearrangeTaskInProjectAsync({source, destination, taskId: tasks[taskId]._id, projectId: projectCopy._id, isSame: destination.hid === source.hid}));
                dispatch(updateProjectAsync(projectCopy));
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
        dispatch(addToTodaysTasks({fid: task.fid, _id: task._id}));
    });

    const doRemoveTask = useCallback((task) => {
        dispatch(removeFromTodaysTasks({
            fid: task.fid,
            _id: task._id
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

        let totalTasks = project.to.length;
        for(let sectionId of project.so) {
            totalTasks += project.sections[sectionId].to.length;
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
                                            {project.to.map((item, index) => 
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
                    (<EditTaskContainer defaultProjectId={project._id || project.fid} task={{}} saveTask={addTaskToProject} />)
                }
                </div>

                <div className={styles['completed-task']}>
                    <CompletedTasksList container='projects' projectId={project.fid} tasks={completedTasks}/>
                </div>
                </div>
                {
                    (<SectionList 
                        order={project.so} 
                        sections={project.sections}
                        onCreateSection={onSectionCreate}
                        onAddTaskToSection={onAddTaskToSection}
                        isDragging={isDragging}
                        doAddTask={doAddTask}
                        doRemoveTask={doRemoveTask}
                        isTaskDragging={isTaskDragging}
                        projectId={project._id || project.fid}
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