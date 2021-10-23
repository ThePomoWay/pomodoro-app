import { Close, Search } from "@material-ui/icons";
import React from "react";
import { useSelector } from "react-redux";
import { selectTasksByDate } from "../../state/selectors";
import { getDateStr } from "../../utils/common";
import TaskItem from "../task/task";

import "./AllTaskSidebar.scss";

export function AllTaskSidebar(props) {
    let [dates, tasksObj] = useSelector(selectTasksByDate);

    let getTasks = () => {
        if(dates.length > 0){
            return (dates.map((item, ind) => (
                <div key={ind}>
                    <span>{getDateStr(item)}</span>
                    <div className="tasks">
                        {tasksObj[item].map(item => (<TaskItem task={item} key={item.fid}></TaskItem>))}
                    </div>
                </div>)))
        }
        return (<div>
            Add Tasks to access this area
        </div>)
    }
    return (
        <div className={`sidebar ${props.show ? 'show' : ''}`}>
            <div className="close" onClick={(e) => {props.onClose()}}>
                <Close></Close>
            </div>

            <div className="search-bar">
                <Search></Search>
                <span className="label">Search Tasks</span>
            </div>

            <div className="task-list">
                {getTasks()}
            </div>
        </div>
    );
}