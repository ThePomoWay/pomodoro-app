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
import AuthService from "../../API/network/AuthService";
import { selectProjectOrder, selectProjectsObj } from "../../state/selectors";
import {
  openOnboardingModal,
  setProjectModalState,
} from "../../state/slices/GlobalSlice";
import { AccordionIcon } from "../../svgs/AccordionIcon";
import { ProjectSidenavIcon } from "../../svgs/ProjectSidenavIcon";

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
      let inboxId = AuthService.getInboxProjectId();
      return (
        <div>
          {projectsOrder
            .filter((item) => projectsObj[item])
            .filter((item) => item !== inboxId)
            .map((item, ind) => (
              <Link key={ind} to={`/all/project/${item}`}>
                <div
                  className={`${styles["sidebar-row"]} ${styles["project"]} ${
                    projectId ===
                      (projectsObj[item] && projectsObj[item]._id) &&
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
    if (AuthService.isLoggedIn()) {
      dispatch(setProjectModalState(true));
    } else {
      dispatch(openOnboardingModal());
    }
  });

  return (
    <div>
      <div className={styles["project-sidebar"]}>
        <ProjectSidenavIcon />
        Lists
        <span
          onClick={(e) => openNewProjectModal()}
          className={`${styles["accordion"]}`}
        >
          <Add />
        </span>
      </div>
      <div className={styles["project-sidebar-second"]}>
        {/* <div className={`${styles["sidebar-row"]} ${styles["create-project"]}`}>
          Create a project
        </div> */}
        {projectExpanded && getProjects()}
      </div>
    </div>
  );
};
