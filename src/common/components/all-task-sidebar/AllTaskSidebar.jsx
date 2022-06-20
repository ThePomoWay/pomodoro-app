import { InboxOutlined } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { InboxSvg } from "../../svgs/InboxSvg";
import { PrioritySidebar } from "../priority-sidebar/PrioritySidebar";
import ProjectSidebar from "../project-sidebar/ProjectSidebar";
import { TagsSidebar } from "../tags-sidebar/TagsSidebar";
import styles from "./AllTaskSidebar.module.scss";

import { ReactComponent as CompletedTaskSvg } from "../../svgs/CompletedTaskSvg.svg";

export default () => {
  let path = window.location.pathname;

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
      <Link to="/all/completed-tasks">
        <div
          className={`${styles["sidebar-item"]} ${
            path === "/all/completed-tasks" && styles["selected"]
          }`}
        >
          <CompletedTaskSvg />
          Completed Tasks
        </div>
      </Link>
      <ProjectSidebar className={styles["sidebar-item"]} />
      <TagsSidebar />
      <PrioritySidebar />
    </div>
  );
};
