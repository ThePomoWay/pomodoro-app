import { Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core";
import { ExpandMoreOutlined } from "@material-ui/icons";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTagsAsObj } from "../../state/selectors";
import { markTaskAsInCompleteThunk } from "../../state/slices/TasksSlice";
import TaskItem from "../task/task";

export default (props) => {
    let tasks = props.tasks;
    let dispatch = useDispatch();
    let tags = useSelector(selectTagsAsObj);

    const onTaskUncomplete = useCallback((task) => {
        dispatch(markTaskAsInCompleteThunk({task, container: props.container, projectId: props.projectId, sectionId: props.sectionId}))
    })

    if(tasks && tasks.length > 0) {
        return (
            <Accordion elevation={0}>
                <AccordionSummary expandIcon={(<ExpandMoreOutlined />)}>
                    <p>Completed Task</p>
                </AccordionSummary>
                <AccordionDetails>
                    {tasks.map(item => (
                        <TaskItem 
                        key={item.fid+'completed'}
                        task={item}
                        tags={tags}
                        onComplete={onTaskUncomplete}
                        />
                    ))}
                </AccordionDetails>
            </Accordion>
        )
    }
    return (<div></div>)
}