import { Link, useHistory } from "react-router-dom";
import { InboxSvg } from "../../svgs/InboxSvg";
import { PrioritySidebar } from "../priority-sidebar/PrioritySidebar";
import ProjectSidebar from "../project-sidebar/ProjectSidebar";
import { TagsSidebar } from "../tags-sidebar/TagsSidebar";
import styles from "./AllTaskSidebar.module.scss";

import { useDispatch } from "react-redux";
import AuthService from "../../API/network/AuthService";
import { openOnboardingModal } from "../../state/slice/GlobalSlice";
import { ReactComponent as CompletedTaskSvg } from "../../svgs/CompletedTaskSvg.svg";

export default () => {
  let path = window.location.pathname;

  let history = useHistory();
  let dispatch = useDispatch();
  let navigateAfterLogin = (link) => {
    if (AuthService.isLoggedIn()) {
      history.push(link);
    } else {
      dispatch(openOnboardingModal());
    }
  };

  return (
    <div className={styles["sidebar"]}>
      <Link to="/all">
        <div
          className={`${styles["sidebar-item"]} ${
            path === "/all" && styles["selected"]
          }`}
        >
          <InboxSvg />
          Inbox
        </div>
      </Link>
      <ProjectSidebar className={styles["sidebar-item"]} />
      <TagsSidebar />
      <PrioritySidebar />
      <div
        onClick={(e) => navigateAfterLogin("/all/completed-tasks")}
        className={`${styles["sidebar-item"]} ${
          path === "/all/completed-tasks" && styles["selected"]
        }`}
      >
        <CompletedTaskSvg />
        Completed Tasks
      </div>
    </div>
  );
};
