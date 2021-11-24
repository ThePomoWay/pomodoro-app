import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DraggableTaskList from "../../common/components/draggable-task-list/DraggableTaskList";
import Navbar from "../../common/components/navbar/navbar";
import { getAllTasks } from "../../common/state/async";
import { selectAllTasks, selectTodaysTaskIds, selectTodaysTasks } from "../../common/state/selectors";
import { addToAllTasks, addToTodaysTasks, getTodaysTasks, rearrangeAllTasks, rearrangeTodaysTask, removeFromAllTasks, removeFromTodaysTasks } from "../../common/state/slices/TasksSlice";
import { todaysTasksDropId } from "../../common/utils/constants";

import { DragDropContext } from "react-beautiful-dnd";

import styles from "./AllTasks.module.scss";
import { getObjFromArr } from "../../common/utils/common";
import AllTaskContainer from "../../common/components/all-task-container/AllTaskContainer";

import { Switch, useRouteMatch, Route } from "react-router-dom"
import AllTaskSidebar from "../../common/components/all-task-sidebar/AllTaskSidebar";
import NewProjectContainer from "../../common/components/new-project-container/NewProjectContainer";
import ProjectContainer from "../../common/components/project-container/ProjectContainer";
import { getAllProjects } from "../../common/state/slices/ProjectSlice";
import { AddNewTask } from "../../common/components/new-task-btn/AddNewTask";
import NewLabelContainer from "../../common/components/new-label-container/NewLabelContainer";
import LabelContainer from "../../common/components/label-container/LabelContainer";
import { getAllTags } from "../../common/state/slices/TagsSlice";
import PriorityContainer from "../../common/components/priority-container/PriorityContainer";

export default () => {
    let alltasks = useSelector(selectAllTasks);
    let todaystasks = useSelector(selectTodaysTasks);

    let todaysTaskIds = useSelector(selectTodaysTaskIds);
    let todaysTaskIdsObj = getObjFromArr(todaysTaskIds);

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllTasks());
        dispatch(getTodaysTasks());
        dispatch(getAllProjects());
        dispatch(getAllTags());
    }, []);

    let onDragEnd = useCallback((result) => {
        console.log(result)
        if(result.destination && result.source) {
            if(result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index) {
                return;
            }

            if(result.destination.droppableId === result.source.droppableId){
                let action = result.source.droppableId === todaysTasksDropId ? rearrangeTodaysTask : rearrangeAllTasks;
                dispatch(action({
                    source: result.source.index,
                    destination: result.destination.index
                }))
            }
            else {
                let removeAction = result.source.droppableId === todaysTasksDropId ? removeFromTodaysTasks : removeFromAllTasks;
                let addAction;
                let item;

                if(result.destination.droppableId === todaysTasksDropId) {
                    addAction = addToTodaysTasks;
                    item = todaystasks[result.source.index].fid;
                }
                else {
                    addAction = addToAllTasks;
                    item = alltasks[result.source.index].fid;
                }

                dispatch(removeAction({
                    index: result.source.index
                }));



                dispatch(addAction({
                    index: result.destination.index,
                    item
                }))
            }
            
        }
        
    }, []);

    let { path } = useRouteMatch();

    return (
        <div className="container">
            <div>
                <Navbar selected="1"></Navbar>
            </div>
            <div className={styles['main-view']}>
                <div className={styles.sidebar}>
                    <AllTaskSidebar></AllTaskSidebar>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                    
                    <div className={styles['middle-container']}>
                    <Switch>
                        <Route exact path={path}>
                            <AllTaskContainer
                                todaysTasksIds={todaysTaskIdsObj}
                                tasks={alltasks}
                                container="all"
                            />
                            <AddNewTask isTodaysTask={false} />
                        </Route>

                        <Route exact path={`${path}/project`}>
                            <NewProjectContainer />
                        </Route>

                        <Route path={`${path}/project/:projectId`}>
                            <ProjectContainer />
                        </Route>

                        <Route exact path={`${path}/labels`}>
                            <NewLabelContainer />
                        </Route>
                        <Route path={`${path}/labels/:labelId`}>
                            <LabelContainer />
                        </Route>

                        <Route path={`${path}/priority/:priority`}>
                            <PriorityContainer />
                        </Route>

                    </Switch>
                    </div>
                    <div className={styles['todays-task-container']}>
                        <div className={styles['todays-task-list']}>
                            <h2>Todays Tasks</h2>
                            <DraggableTaskList
                                hidePlay={true}
                                tasks={todaystasks} 
                                dropId="id-1e" />
                        </div>
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
}