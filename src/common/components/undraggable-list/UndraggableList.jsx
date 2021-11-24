import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectProjectsObj, selectTagsAsObj } from "../../state/selectors";
import { updateTaskThunk } from "../../state/slices/TasksSlice";
import EditTaskContainer from "../new-task-modal/EditTaskContainer";
import TaskItem from "../task/task";

export default function UndraggableList(props) {
    let tags = useSelector(selectTagsAsObj);
    let projects = useSelector(selectProjectsObj);

    let [editTaskfid, setEditTaskIndex] = useState('');

    let dispatch = useDispatch();

    const toggleCompletedTasks = useCallback((task) => {});
    const doSetEditTask = useCallback((task) => {
        if(task.fid) {
            setEditTaskIndex(task.fid);
        }
    });

    const doSaveTask = useCallback((task) => {
        if(task.fid) {
            dispatch(updateTaskThunk(task))
        }
    
        setEditTaskIndex('');

    })

    if(props.tasks && props.tasks.length > 0) {
        return (
            <div className="list">
            {props.tasks.map((item, index) => {
                if(item.fid === editTaskfid) {
                    return (<EditTaskContainer key={item.fid+'drag'} task={item} saveTask={doSaveTask} />)
                }

                return (
                <TaskItem
                    hidePlay={true}
                    tags={tags} 
                    projects={projects}
                    task={item} 
                    key={item.fid+'tags'} 
                    index={index} 
                    onComplete={toggleCompletedTasks}
                    onClick={doSetEditTask}
                ></TaskItem>
            )})}
            </div>
        )
    }
    return (
        <div>loading...</div>
    )
}