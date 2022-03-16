import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProjectAsync,
  updateLocalProjectAsync,
  updateProjectAsync,
} from "../../state/thunks/ProjectThunk";
import { setEditProjectId } from "../../state/slice/ProjectSlice";
import { generateUniqueId } from "../../utils/common";

import { useRouteMatch, useHistory } from "react-router-dom";

import styles from "./NewProjectContainer.module.scss";
import { Modal } from "@mui/material";
import {
  selectEditProject,
  selectNewProjectModal,
  selectProjectsObj,
} from "../../state/selectors";
import {
  setProjectModalState,
  showErrorToast,
} from "../../state/slice/GlobalSlice";
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
      if (projectTitle) {
        dispatch(
          updateProjectAsync({
            ...projects[editProjectId],
            title: projectTitle,
          })
        );

        dispatch(setEditProjectId(""));
        setProjectTitle("");
        handleClose();
      } else {
        dispatch(showErrorToast("Project title cannot be empty"));
      }
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
          redirect: true,
        })
      );

      // setTimeout(() => {
      //   history.push(`/all/project/${fid}`);
      // }, 500);
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
        <span className="close" onClick={handleClose}>
          <Close />
        </span>
        <div className="modal-content">
          <div className={styles["main"]}>
            <p className={styles["title"]}>Create a List</p>
            <input
              className={styles["input"]}
              value={projectTitle}
              placeholder="Type list name here..."
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
      </div>
    </Modal>
  );
};
