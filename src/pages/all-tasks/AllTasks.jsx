import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DraggableTaskList from "../../common/components/draggable-task-list/DraggableTaskList";
import Navbar from "../../common/components/navbar/navbar";
import ProjectSidebar from "../../common/components/project-sidebar/ProjectSidebar";
import { getAllTasks } from "../../common/state/async";
import { selectAllTasks, selectTodaysTaskIds, selectTodaysTasks } from "../../common/state/selectors";
import { addToAllTasks, addToTodaysTasks, rearrangeAllTasks, rearrangeTodaysTask, removeFromAllTasks, removeFromTodaysTasks } from "../../common/state/slices/TasksSlice";
import { todaysTasksDropId } from "../../common/utils/constants";

import { DragDropContext } from "react-beautiful-dnd";

import styles from "./AllTasks.module.scss";
import PlannerDraggableList from "../../common/components/PlannerDraggableList/PlannerDraggableList";
import { getObjFromArr } from "../../common/utils/common";

export default () => {
    let alltasks = useSelector(selectAllTasks);
    let todaystasks = useSelector(selectTodaysTasks);

    let todaysTaskIds = useSelector(selectTodaysTaskIds);
    let todaysTaskIdsObj = getObjFromArr(todaysTaskIds);

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllTasks());
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

    return (
        <div className="container">
            <div>
                <Navbar selected="1"></Navbar>
            </div>
            <div className={styles['main-view']}>
                <div className={styles.sidebar}>
                    <ProjectSidebar></ProjectSidebar>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className={styles['all-task-container']}>
                        <div className={styles['all-task-list']}>
                            <h2>Inbox</h2>
                            <PlannerDraggableList todaysTasksIds={todaysTaskIdsObj} tasks={alltasks} dropId="id-2e" />
                        </div>
                    </div>
                    <div className={styles['todays-task-container']}>
                    <div className={styles['todays-task-list']}>
                            <h2>Todays Tasks</h2>
                            <DraggableTaskList tasks={todaystasks} dropId="id-1e" />
                        </div>
                    </div>
                    </DragDropContext>
            </div>
        </div>
    );
}