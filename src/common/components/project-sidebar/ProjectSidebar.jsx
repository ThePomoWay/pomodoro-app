import {  AddCircleOutlineOutlined, HomeWorkOutlined, WorkOutlined, WorkOutlineOutlined } from "@material-ui/icons";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useRouteMatch, Link, useParams } from "react-router-dom";
import { selectProjectOrder, selectProjectsObj } from "../../state/selectors";
import { addWindowUnloadFn } from "../../utils/common";


import styles from "./projectSidebar.module.scss";

export default () => {
    let {path} = useRouteMatch();

    let projectsObj = useSelector(selectProjectsObj);
    let projectsOrder = useSelector(selectProjectOrder);

    let [projectExpanded, setProjectExpanded] = useState(true);

    let pathname = window.location.pathname;
    let projectId = pathname.split('/all/project/')[1];

    const onProjectClick = useCallback((projectId) => {
        window.location.href = `/all/project/${projectId}`
    })

    const getProjects = useCallback(() => {
        if(projectsOrder.length <= Object.keys(projectsObj).length) {
            return (
                <div>
                    {projectsOrder.map((item, ind) => (
                        <Link key={ind} to={`/all/project/${item}`}>
                        <div
                            
                            className={`${styles['sidebar-row']} ${projectId === projectsObj[item].fid && styles['selected']}`}>
                            {projectsObj[item].title}
                        </div>
                        </Link>
                    ))}
                </div>
            )
        }
        return (<div></div>);
    })

    return (
        <div>
            <div className={styles['project-sidebar']}>
                <WorkOutlineOutlined />
                Projects
                <span onClick={(e) => setProjectExpanded(!projectExpanded)} className={`${styles['accordion']} ${projectExpanded ? styles['up-arrow'] : styles['down-arrow']}`}>
                </span>
            </div>
            <div className={styles['project-sidebar-second']}>
            {projectExpanded && 
                getProjects()
            }
            <Link to="/all/project">
                <div className={`${styles['sidebar-row']} text-gray`}>
                    <AddCircleOutlineOutlined />
                    Create a project
                </div>
            </Link>
            </div>
        </div>

    )
}