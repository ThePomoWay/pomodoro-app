import { InboxOutlined } from "@material-ui/icons";
import { Link } from "react-router-dom"
import { PrioritySidebar } from "../priority-sidebar/PrioritySidebar";
import ProjectSidebar from "../project-sidebar/ProjectSidebar";
import { TagsSidebar } from "../tags-sidebar/TagsSidebar";
import styles from "./AllTaskSidebar.module.scss";

export default () => {
    let path = window.location.pathname;

    return (
    <div className={styles['sidebar']}>
        <Link to="/all">
       <div className={`${styles['sidebar-item']} ${path === '/all' && styles['selected']}`}>
            <InboxOutlined />
            Inbox
            
       </div>
       </Link>
        <ProjectSidebar className={styles['sidebar-item']} />
        <TagsSidebar />
        <PrioritySidebar />
    </div>)
}