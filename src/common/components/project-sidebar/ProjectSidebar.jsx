import { Add } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AuthService from "../../API/network/AuthService";
import { usePaymentStatus } from "../../hooks/PaymentHook";
import { selectProjectOrder, selectProjectsObj } from "../../state/selectors";
import {
  openOnboardingModal,
  setPricingModalState,
  setProjectModalState,
} from "../../state/slice/GlobalSlice";
import { ProjectSidenavIcon } from "../../svgs/ProjectSidenavIcon";

import styles from "./projectSidebar.module.scss";

export default function ProjectSidebar() {
  let projectsObj = useSelector(selectProjectsObj);
  let projectsOrder = useSelector(selectProjectOrder);

  let { isSubscriptionActive } = usePaymentStatus();

  let dispatch = useDispatch();

  let pathname = window.location.pathname;
  let projectId = pathname.split("/all/project/")[1];

  // const onProjectClick = useCallback((projectId) => {
  //   window.location.href = `/all/project/${projectId}`;
  // });

  const getProjects = () => {
    if (projectsOrder.length <= Object.keys(projectsObj).length) {
      let inboxId = AuthService.getInboxProjectId();
      return (
        <div className={styles["project-rows"]}>
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
  };

  const openNewProjectModal = () => {
    if (AuthService.isLoggedIn()) {
      if (projectsOrder.length > 5 && !isSubscriptionActive) {
        dispatch(setPricingModalState(true));
      } else {
        dispatch(setProjectModalState(true));
      }
    } else {
      dispatch(openOnboardingModal());
    }
  };

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
        {getProjects()}
      </div>
    </div>
  );
}
