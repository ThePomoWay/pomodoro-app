import { Done } from "@material-ui/icons";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../API/network/AuthService";
import { selectProjectsObj } from "../../state/selectors";
import { openOnboardingModal } from "../../state/slices/GlobalSlice";
import { setTimerSec } from "../../state/slices/TimerSlice";
import styles from "./ProjectSelector.module.scss";
export default function ProjectSelector(props) {
  let projects = useSelector(selectProjectsObj);
  let projectIds = Object.keys(projects);
  let dispatch = useDispatch();

  let [selectedProjectId, setSelectedProjectId] = useState(
    (props.project && props.project.projectID) || ""
  );
  let [selectedSectionId, setSelectedSectionId] = useState(
    (props.project && props.project.secID) || ""
  );

  const onProjectSelect = useCallback((projectId) => {
    setSelectedProjectId(projectId);
    props.onChange && props.onChange(projectId, selectedSectionId);
  });

  const onSectionSelect = useCallback((projectId, secId, e) => {
    setSelectedProjectId(projectId);
    setSelectedSectionId(secId);

    props.onChange && props.onChange(projectId, secId);

    e.stopPropagation();
  });

  const onLogin = useCallback(() => {
    dispatch(openOnboardingModal());
  });

  if (projectIds.length === 0) {
    return (
      <div className="popover">
        <div className={`${styles["title"]} popover-title`}>
          Please create a project from all tasks
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles["project-container"]} popover`}>
      <div className="popover-title">
        {(AuthService.isLoggedIn() && <p>Select another project</p>) || (
          <p>
            <a
              href="javascript:void(0)"
              className={styles["login"]}
              onClick={(e) => onLogin()}
            >
              Login
            </a>{" "}
            to create a project
          </p>
        )}
      </div>
      {AuthService.isLoggedIn() &&
        projectIds.map((item, index) => (
          <div
            key={projects[item]._id + "project"}
            className={`${styles["projects"]} popover-normal-item ${
              item === selectedProjectId ? "popover-normal-item-selected" : ""
            }`}
            onClick={(e) => onProjectSelect(item)}
          >
            {projects[item].title}
            {/* <div className={styles['sections']}>
                        {projects[item].so.map(sectionId => (
                            <div 
                                key={sectionId + 'project-container'} 
                                className={`${styles['section']} ${sectionId === selectedSectionId ? styles['selected'] : ''}  currsor-pointer`}
                                onClick={(e) => onSectionSelect(item, sectionId, e)}>
                                {projects[item].sections[sectionId].title}
                            </div>
                        ))}
                    </div> */}
            {item === selectedProjectId && (
              <Done className="popover-select-tick" />
            )}
          </div>
        ))}
    </div>
  );
}
