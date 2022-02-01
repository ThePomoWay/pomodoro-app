import {
  Add,
  AddCircleOutlineOutlined,
  HomeWorkOutlined,
  WorkOutlined,
  WorkOutlineOutlined,
} from "@material-ui/icons";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch, Link, useParams } from "react-router-dom";
import { selectProjectOrder, selectProjectsObj } from "../../state/selectors";
import { setProjectModalState } from "../../state/slices/GlobalSlice";

import styles from "./projectSidebar.module.scss";

export default () => {
  let { path } = useRouteMatch();

  let projectsObj = useSelector(selectProjectsObj);
  let projectsOrder = useSelector(selectProjectOrder);

  let [projectExpanded, setProjectExpanded] = useState(true);

  let dispatch = useDispatch();

  let pathname = window.location.pathname;
  let projectId = pathname.split("/all/project/")[1];

  const onProjectClick = useCallback((projectId) => {
    window.location.href = `/all/project/${projectId}`;
  });

  const getProjects = useCallback(() => {
    if (projectsOrder.length <= Object.keys(projectsObj).length) {
      return (
        <div>
          {projectsOrder
            .filter((item) => projectsObj[item])
            .map((item, ind) => (
              <Link key={ind} to={`/all/project/${item}`}>
                <div
                  className={`${styles["sidebar-row"]} ${styles["project"]} ${
                    projectId ===
                      (projectsObj[item] && projectsObj[item].fid) &&
                    styles["selected"]
                  }`}
                >
                  <span className="dot" style={{ marginRight: "10px" }}></span>
                  {(projectsObj[item] && projectsObj[item].title) ||
                    "Project Not found"}
                </div>
              </Link>
            ))}
        </div>
      );
    }
    return <div></div>;
  });

  const openNewProjectModal = useCallback(() => {
    dispatch(setProjectModalState(true));
  });

  return (
    <div>
      <div className={styles["project-sidebar"]}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="4.875"
            y="2.375"
            width="14.25"
            height="19.25"
            rx="2.625"
            fill="#5169DD"
            stroke="white"
            strokeWidth="0.75"
          />
          <line
            x1="7.5"
            y1="7.125"
            x2="16.5"
            y2="7.125"
            stroke="white"
            strokeWidth="0.75"
          />
          <line
            x1="7.5"
            y1="11.625"
            x2="16.5"
            y2="11.625"
            stroke="white"
            strokeWidth="0.75"
          />
          <line
            x1="7.5"
            y1="16.125"
            x2="16.5"
            y2="16.125"
            stroke="white"
            strokeWidth="0.75"
          />
        </svg>
        Projects
        <span
          onClick={(e) => setProjectExpanded(!projectExpanded)}
          className={`${styles["accordion"]} ${
            projectExpanded ? "up-arrow" : "down-arrow"
          }`}
        ></span>
      </div>
      <div className={styles["project-sidebar-second"]}>
        <div
          className={`${styles["sidebar-row"]} ${styles["create-project"]}`}
          onClick={(e) => openNewProjectModal()}
        >
          <Add />
          Create a project
        </div>
        {projectExpanded && getProjects()}
      </div>
    </div>
  );
};
