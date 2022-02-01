import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProjectAsync,
  setEditProjectId,
  setEditProjectName,
  updateProjectAsync,
} from "../../state/slices/ProjectSlice";
import { generateUniqueId } from "../../utils/common";

import { useRouteMatch, useHistory } from "react-router-dom";

import styles from "./NewProjectContainer.module.scss";
import { Modal } from "@mui/material";
import {
  selectEditProject,
  selectNewProjectModal,
  selectProjectsObj,
} from "../../state/selectors";
import { setProjectModalState } from "../../state/slices/GlobalSlice";
import { Close } from "@material-ui/icons";

export default () => {
  let [projectTitle, setProjectTitle] = useState("");
  let { path } = useRouteMatch();

  let isModalOpen = useSelector(selectNewProjectModal);

  let editProjectId = useSelector(selectEditProject);
  let projects = useSelector(selectProjectsObj);

  useEffect(() => {
    if (editProjectId && projects[editProjectId]) {
      setProjectTitle(projects[editProjectId].title);
    }
  }, [editProjectId]);

  let dispatch = useDispatch();
  let history = useHistory();

  let handleClose = useCallback(() => {
    dispatch(setProjectModalState(false));
  });

  const saveProject = useCallback(() => {
    if (editProjectId) {
      dispatch(
        updateProjectAsync({
          ...projects[editProjectId],
          title: projectTitle,
        })
      );

      dispatch(setEditProjectId(""));
    }
    if (projectTitle.length > 0) {
      let fid = generateUniqueId();

      dispatch(
        createProjectAsync({
          project: {
            fid,
            title: projectTitle,
            sections: {},
            so: [],
            to: [],
            isArchived: false,
          },
          path,
        })
      );

      setTimeout(() => {
        history.push(`/all/project/${fid}`);
      }, 500);
    }
  });

  const onKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      saveProject();
    }
  });

  return (
    <Modal
      open={isModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="modal-container">
        <div className={styles["main"]}>
          <p className={styles["title"]}>
            Create a project
            <Close style={{ cursor: "pointer" }} onClick={handleClose} />
          </p>
          <input
            className={styles["input"]}
            value={projectTitle}
            placeholder="Type project name here..."
            onChange={(e) => setProjectTitle(e.target.value)}
            onKeyUp={(e) => onKeyDown(e)}
          />
          <div className={styles["right"]}>
            <button className="btn btn-cancel" onClick={(e) => handleClose()}>
              Cancel
            </button>
            <button className="btn btn-save" onClick={(e) => saveProject()}>
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
