import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTodaysTasks } from "../../state/selectors";
import DraggableTaskList from "../draggable-task-list/DraggableTaskList";
import { AddNewTask } from "../new-task-btn/AddNewTask";
import {DragDropContext} from "react-beautiful-dnd";

import "./todaysTaskContainer.scss";
import { rearrangeTodaysTask } from "../../state/slices/TasksSlice";

export function TodaysTaskContainer () {
    let tasks = useSelector(selectTodaysTasks);

    
    let dispatch = useDispatch();

    let onDragEnd = useCallback((result) => {
        console.log(result)
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

    let getTasks = useCallback((tasks) => {
        if(!tasks || tasks.length === 0) {
            return (
                <div className="empty-state">
                    <span className="title">Morning! Start your day and accomplish your goals for the day</span>
                    <span className="label">Add new tasks to the list and start your pomodoro !</span>
                    <img src="/empty-tasks.png" alt="Empty tasks"/>
                    <AddNewTask></AddNewTask>
                </div>
            );
        }
        return (
            <div className="task-list">
                <span className="title">Give your 100% today! unless you're donating blood</span>
                <div className="task-container">
                <DragDropContext onDragEnd={onDragEnd}>
                    <DraggableTaskList tasks={tasks} dropId="id-1e" isEditable="true" />
                </DragDropContext>
                </div>
                <AddNewTask></AddNewTask>
        </div>);
    }, [])

    return getTasks(tasks);
}