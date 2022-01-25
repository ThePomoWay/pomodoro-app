import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTagsAsObj, selectTodaysCompletedTasks, selectTodaysTasks } from "../../state/selectors";
import DraggableTaskList from "../draggable-task-list/DraggableTaskList";
import { AddNewTask } from "../new-task-btn/AddNewTask";
import {DragDropContext} from "react-beautiful-dnd";

import styles from "./todaysTaskContainer.module.scss";
import { markTaskAsInCompleteThunk, rearrangeTodaysTask } from "../../state/slices/TasksSlice";
import TaskItem from "../task/task";
import { getTodaysDateFormatted } from "../../utils/date-utils";
import { DailyStats } from "../daily-stats/DailyStats";

export function TodaysTaskContainer () {
    let tasks = useSelector(selectTodaysTasks);
    let completedTasks = useSelector(selectTodaysCompletedTasks);
    let tags = useSelector(selectTagsAsObj);
    
    let dispatch = useDispatch();

    let onDragEnd = useCallback((result) => {
        if(result.destination && result.source) {
            if(result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index) {
                return;
            }

            dispatch(rearrangeTodaysTask({
                source: result.source.index,
                destination: result.destination.index
            })) 
        }
    }, []);

    let onTaskUncomplete = useCallback((task) => {
        dispatch(markTaskAsInCompleteThunk({task, container: 'todays'}));
    });

    let getTasks = useCallback((tasks, completedTasks) => {
        if(!tasks || (tasks.length === 0 && completedTasks.length === 0)) {
            return (
                <div className={styles['empty-state']}>
                    <span className={styles["title"]}>Today's Tasks</span>
                    <DailyStats />
                    <img src="/empty-tasks.png" alt="Empty tasks"/>
                    <AddNewTask isTodaysTask={true}></AddNewTask>
                </div>
            );
        }
        return (
            <div className={styles["task-list"]}>
                <span className={styles["title"]}>Today's Tasks</span>
                <span className={styles['subtitle']}>{getTodaysDateFormatted()}</span>
                <div className={styles["task-container"]}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <DraggableTaskList
                            container='todays'
                            tasks={tasks}
                            tags={tags}
                            dropId="id-1e"
                            isEditable="true" />
                    </DragDropContext>
                    <AddNewTask isTodaysTask={true}></AddNewTask>
                    
                    {completedTasks.length > 0 && 
                    (<div className={styles['completed-tasks']}>
                        <p> Completed tasks </p>
                        {completedTasks.map(item => (
                            <TaskItem 
                                key={item.fid+'complete'}
                                task={item}
                                tags={tags}
                                onComplete={onTaskUncomplete}
                                />
                        ))}
                    </div>)
                    }
                        
                        
                </div>
                
        </div>);
    }, [])

    return getTasks(tasks, completedTasks);
}