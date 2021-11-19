import { useCallback } from "react";
import { useSelector } from "react-redux";
import { selectProjectsObj, selectTagsAsObj } from "../../state/selectors";
import TaskItem from "../task/task";

export default function UndraggableList(props) {
    let tags = useSelector(selectTagsAsObj);
    let projects = useSelector(selectProjectsObj);

    const toggleCompletedTasks = useCallback((task) => {});
    const doSetEditTask = useCallback((task) => {});

    if(props.tasks && props.tasks.length > 0) {
        return (
            <div className="list">
            {props.tasks.map((item, index) => (
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
            ))}
            </div>
        )
    }
    return (
        <div>loading...</div>
    )
}