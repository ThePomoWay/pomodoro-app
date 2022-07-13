import { ClickAwayListener, Popper } from "@material-ui/core";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../API/network/AuthService";
import {
  selectProjectsObj,
  selectTagsAsArr,
  selectTagsAsObj,
} from "../../state/selectors";
import { showErrorToast } from "../../state/slice/GlobalSlice";
import { PriorityFlag } from "../../svgs/PriorityFlag";
import { PriorityIcon } from "../../svgs/PriorityIcon";
import { generateUniqueId } from "../../utils/common";
import { priorityColorMap } from "../../utils/constants";
import AddTagContainer from "../add-tag-container/AddTagContainer";
import EstimatedPomos from "../estimate-pomos/EstimatedPomos";
import { PrioritySelector } from "../priority-selector/PrioritySelector";
import ProjectSelector from "../project-selector/ProjectSelector";
import TaskDescription from "../task-description/TaskDescription";

import styles from "./EditTaskContainer.module.scss";

let setEndOfContentEditable = (elem) => {
  let range, selection;
  if (document.createRange) {
    range = document.createRange();
    range.selectNodeContents(elem);
    range.collapse(false);
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  } else if (document.selection) {
    range = document.body.createTextRange();
    range.moveToElementText(elem);
    range.collapse(false);
    range.select();
  }
};

export default function EditTaskContainer(props) {
  let taskToBeEdited = props.task || {};

  let tags = useSelector(selectTagsAsObj);
  let projectsObj = useSelector(selectProjectsObj);

  let ref = useRef(null);

  let [title, setTitle] = useState(taskToBeEdited.title || "");
  let [priority, setPriority] = useState(taskToBeEdited.priority || -1);
  let [description, setDescription] = useState(
    taskToBeEdited.description || ""
  );
  let [schedule, setSchedule] = useState(taskToBeEdited.schedule || new Date());
  let [estimatedPomos, setEstimatedPomos] = useState(taskToBeEdited.epomo || 0);
  let [isBulleted, setIsBulleted] = useState(
    taskToBeEdited.isBulleted || false
  );
  let [project, setProject] = useState(
    taskToBeEdited.project || {
      projectID: props.defaultProjectId || AuthService.getInboxProjectId(),
      secID: props.defaultSectionId || "",
    }
  );

  let [tagAnchorEl, setTagAnchorEl] = useState(null);
  let [priorityAncholEl, setPriorityAnchorEl] = useState(null);
  let [projectAnchorEl, setProjectAnchorEl] = useState(null);

  let [selectedTags, setSelectedTags] = useState(taskToBeEdited.labels || []);

  let dispatch = useDispatch();

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.textContent = taskToBeEdited.title || "";

      ref.current.focus();
      ref.current.setSelectionRange(
        ref.current.value.length,
        ref.current.value.length
      );
      // setEndOfContentEditable(ref.current);
    }
  }, []);

  const onTagAnchorClick = useCallback((e) => {
    setTagAnchorEl(e.currentTarget);
    e.stopPropagation();
  });

  const onTagAnchorClose = useCallback((e) => {
    setTagAnchorEl(null);
  });

  const onProjectAnchorClick = useCallback((e) => {
    if (!props.viewOnlyProject) {
      setProjectAnchorEl(e.currentTarget);
      e.stopPropagation();
    }
  });

  const onProjectAnchorClose = useCallback((e) => {
    setProjectAnchorEl(null);
  });

  const onPriorityAnchorClick = useCallback((e) => {
    setPriorityAnchorEl(e.currentTarget);
    e.stopPropagation();
  });

  const onPriorityAnchorClose = useCallback((e) => {
    setPriorityAnchorEl(null);
  });

  const closeAllPopover = () => {
    onPriorityAnchorClose();
    onProjectAnchorClose();
    onTagAnchorClose();
  };

  let resetContainer = useCallback((taskToBeEdited) => {
    setTitle(taskToBeEdited.title || "");
    setPriority(taskToBeEdited.priority || -1);
    setDescription(taskToBeEdited.description || "");
    setSelectedTags(taskToBeEdited.labels || []);
    setIsBulleted(taskToBeEdited.isBulleted || false);
    setEstimatedPomos(taskToBeEdited.epomo || 0);

    setProject(
      taskToBeEdited.project || {
        projectID: props.defaultProjectId || "",
        secID: props.defaultSectionId || "",
      }
    );
    // setSchedule(taskToBeEdited.schedule);

    if (ref) {
      ref.current.textContent = taskToBeEdited.title || "";
      setEndOfContentEditable(ref.current);
    }
  }, []);

  let doSaveTask = () => {
    if (title) {
      let task = {
        fid: taskToBeEdited.fid || generateUniqueId(),
        title,
        priority,
        description,
        schedule: schedule.toString(),
        epomo: estimatedPomos,
        isBulleted,
        csec: 0,
        cpomo: 0,
        psec: 0,
        project: {
          projectID: project.projectID || AuthService.getInboxProjectId(),
          secID: project.secID || "",
        },
        labels: selectedTags,
      };

      if (taskToBeEdited.fid) {
        task = {
          ...taskToBeEdited,
          title,
          priority,
          description,
          schedule: schedule.toString(),
          epomo: estimatedPomos,
          labels: selectedTags,
          project: {
            projectID: project.projectID || AuthService.getInboxProjectId(),
            secID: project.secID,
          },
        };
      } else {
        task.createdOn = new Date().toISOString();
      }

      resetContainer({});

      props.saveTask(task);
    } else {
      dispatch(showErrorToast("Please enter a title"));
    }

    // setTitle('');
    // setPriority(2);
    // setDescription('');
    // setShowTitleInput(true);
  };

  let doCancelTask = useCallback(() => {
    props.saveTask({});
  }, []);

  const onTitleInput = useCallback((e) => {
    // if (e.key === 'Enter' && title) {
    //     doSaveTask();
    // }

    // if(e.key === 'Backspace') {
    //     setTitle(title.slice(0,title.length-1));
    // }

    // if((e.keyCode > 64 && e.keyCode < 91) || e.keyCode==32 || (e.keyCode >=48 && e.keycode <=57) ){
    //     setTitle(title + e.key);
    // }

    setTitle(e.target.value.replace(/(\r\n|\n|\r)/gm, ""));
  });

  const onTitleKeyChange = useCallback((e) => {
    if (e.key === "Enter" && title) {
      doSaveTask();
      e.stopPropagation();
    }
  });

  const onLabelUpdate = useCallback((tags) => {
    setSelectedTags(tags);
  });

  const removeTag = useCallback((item) => {
    setSelectedTags(selectedTags.filter((i) => i !== item));
  });

  const setProjectId = useCallback((projectId, sectionId) => {
    setProject({
      projectID: projectId,
      secID: sectionId,
    });
  });

  const getTaskTags = useCallback(() => {
    return (
      <div className={styles["task-tags-list"]}>
        {selectedTags.map((item, ind) => {
          if (tags[item]) {
            return (
              <span
                key={ind}
                className={styles["task-tag-item"]}
                style={{ color: (tags[item] && tags[item].color) || "gray" }}
              >
                #{tags[item] && tags[item].title}
                {/* <Close className={styles['close']} style={{width: '12px'}} onClick={(e) => removeTag(item)} /> */}
              </span>
            );
          }
          return <></>;
        })}
      </div>
    );
  });

  // useEffect(() => {
  //   ref.current.focus();

  //   setEndOfContentEditable(ref.current);
  // });

  return (
    <div>
      <div className={styles["edit-task"]}>
        <textarea
          ref={ref}
          value={title}
          className={styles["content-editable-div"]}
          onChange={onTitleInput}
          onKeyDown={onTitleKeyChange}
          placeholder="Type your task here"
        ></textarea>
        {getTaskTags()}

        <div className={styles["description"]}>
          <TaskDescription
            onChange={(e) => setDescription(e)}
            isBulleted={isBulleted}
            value={description}
          />
        </div>

        <div className={styles["cta-row"]}>
          <div className={styles["estimated-pomos"]}>
            <span className={styles["estimated-pomos-text"]}>
              Estimated Pomodoros:{" "}
            </span>
            <div className={styles["estimated-pomos-container"]}>
              <EstimatedPomos
                default={
                  (taskToBeEdited &&
                    taskToBeEdited.epomo > 5 &&
                    taskToBeEdited.epomo) ||
                  5
                }
                value={estimatedPomos}
                onClick={(value) => {
                  setEstimatedPomos(value);
                }}
              />
            </div>
          </div>
          <ClickAwayListener
            onClickAway={(e) => {
              closeAllPopover();
            }}
          >
            <div className={styles["right-cta"]}>
              {/* <FormatListBulletedOutlined className={`cursor-pointer ${isBulleted ? styles['border-round'] : ''}`} onClick={(e) => setIsBulleted(!isBulleted)} />
               */}

              <div
                className={`cursor-pointer ${styles["project"]}`}
                onClick={(e) => {
                  closeAllPopover();
                  onProjectAnchorClick(e);
                }}
              >
                <svg
                  width="10"
                  height="14"
                  viewBox="0 0 10 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.4"
                    y="0.4"
                    width="9.2"
                    height="13.2"
                    rx="1.6"
                    stroke="#414141"
                    strokeWidth="0.8"
                  />
                  <line
                    x1="3"
                    y1="3.6"
                    x2="7"
                    y2="3.6"
                    stroke="#414141"
                    strokeWidth="0.8"
                  />
                  <line
                    x1="3"
                    y1="6.6"
                    x2="7"
                    y2="6.6"
                    stroke="#414141"
                    strokeWidth="0.8"
                  />
                  <line
                    x1="3"
                    y1="9.6"
                    x2="7"
                    y2="9.6"
                    stroke="#414141"
                    strokeWidth="0.8"
                  />
                </svg>

                {(project.projectID &&
                  projectsObj[project.projectID] &&
                  projectsObj[project.projectID].title) ||
                  "Inbox"}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 4L6 8L10 4" stroke="#414141" />
                </svg>
              </div>
              <Popper
                open={Boolean(projectAnchorEl)}
                id="project-popover"
                anchorEl={projectAnchorEl}
                onClose={(e) => {
                  onProjectAnchorClose(e);
                }}
                position="bottom-left"
              >
                <ProjectSelector onChange={setProjectId} project={project} />
              </Popper>

              <span
                className={`cursor-pointer ${styles["icon-container"]}`}
                onClick={(e) => {
                  closeAllPopover();
                  onTagAnchorClick(e);
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5555 3.00024H11.4666C11.3555 3.00024 11.2443 3.04473 11.1555 3.13355L2.13335 12.1335C1.95555 12.3113 1.95555 12.5779 2.13335 12.7557L8.2222 18.8668C8.31102 18.9556 8.42217 19.0001 8.53331 19.0001C8.64445 19.0001 8.75559 18.9556 8.84441 18.8668L17.8444 9.86685C17.9332 9.77803 17.9777 9.66689 17.9777 9.55575V3.44467C18 3.20022 17.7999 3.00024 17.5555 3.00024ZM17.1111 9.35576L8.55557 17.9335L3.06671 12.4446L11.6444 3.88913H17.1111V9.35576ZM15.4889 5.51138C15.1556 5.17811 14.6889 5.00031 14.2222 5.00031C13.7554 5.00031 13.311 5.17811 12.9554 5.51138C12.6222 5.84465 12.4445 6.31138 12.4445 6.77812C12.4445 7.24486 12.6223 7.68927 12.9556 8.04486C13.2888 8.37813 13.7334 8.55593 14.2223 8.55593C14.6891 8.55593 15.1335 8.37813 15.4891 8.04486C15.8223 7.71159 16.0001 7.26701 16.0001 6.77812C16 6.28923 15.8222 5.84467 15.4889 5.51138ZM14.8444 7.40034C14.5111 7.73361 13.9111 7.73361 13.5776 7.40034C13.4222 7.24471 13.3334 7.02258 13.3334 6.77812C13.3334 6.53367 13.4222 6.31138 13.6 6.1559C13.7778 5.97811 13.9999 5.88928 14.2222 5.88928C14.4666 5.88928 14.6889 5.97811 14.8444 6.1559C15 6.3337 15.111 6.55582 15.111 6.77812C15.1112 7.00025 15.0222 7.24471 14.8444 7.40034Z"
                    fill="#E46780"
                  />
                  <line x1="4.5" y1="2" x2="4.5" y2="7" stroke="#E46780" />
                  <line x1="7" y1="4.5" x2="2" y2="4.5" stroke="#E46780" />
                </svg>
              </span>
              <Popper
                open={Boolean(tagAnchorEl)}
                id="priority-popover"
                anchorEl={tagAnchorEl}
                onClose={(e) => {
                  closeAllPopover();
                  onTagAnchorClose(e);
                }}
                position="bottom-left"
              >
                <AddTagContainer
                  selectedTags={selectedTags}
                  onTagsUpdate={onLabelUpdate}
                ></AddTagContainer>
              </Popper>

              <span
                onClick={(e) => {
                  closeAllPopover();
                  onPriorityAnchorClick(e);
                }}
                className={`${styles["icon-container"]} ${styles["priority-icon"]} cursor-pointer`}
              >
                {(priority === -1 && (
                  <svg
                    fill="#E46780"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.07161 10.4896C6.90808 10.6179 6.67154 10.5893 6.54327 10.4258C6.415 10.2622 6.44358 10.0257 6.6071 9.89746C7.69406 9.04482 9.26042 9.13302 10.2457 10.1175C11.5947 11.4652 13.7896 11.4652 15.1372 10.1176C15.204 10.0508 15.2413 9.96077 15.2413 9.86654V4.01437C15.2413 3.87063 15.1548 3.74116 15.0222 3.68607C14.8895 3.63106 14.7367 3.66151 14.6349 3.76338C13.5631 4.83434 11.8202 4.83462 10.7482 3.76342C9.39916 2.41572 7.20497 2.41569 5.85602 3.76397C5.78998 3.82966 5.75261 3.91999 5.75261 4.01437V18.6237C5.75261 18.8315 5.58413 19 5.37631 19C5.16848 19 5 18.8315 5 18.6237V4.01437C5 3.72016 5.11688 3.43766 5.32462 3.23103C6.96678 1.58967 9.6372 1.58966 11.2801 3.23098C12.0583 4.00854 13.3249 4.00838 14.1028 3.23112C14.4197 2.91419 14.8962 2.8192 15.3107 2.99097C15.7242 3.16279 15.9939 3.56631 15.9939 4.01437V9.86654C15.9939 10.1604 15.8773 10.4419 15.6694 10.6498C14.0279 12.2913 11.3567 12.2913 9.7138 10.6499C8.99856 9.9353 7.86001 9.87117 7.07161 10.4896Z"
                      strokeWidth="0.2"
                    />
                  </svg>
                )) || (
                  <PriorityIcon style={{ fill: priorityColorMap[priority] }} />
                )}
              </span>

              <Popper
                open={Boolean(priorityAncholEl)}
                id="priority-popover"
                anchorEl={priorityAncholEl}
                position="bottom-left"
              >
                <PrioritySelector
                  priority={priority}
                  onChange={(item) => {
                    setPriority(item);
                    onPriorityAnchorClose();
                  }}
                />
              </Popper>
            </div>
          </ClickAwayListener>
        </div>
      </div>
      <div className={styles["save-cta"]}>
        <button
          className="btn btn-save"
          onClick={() => {
            doSaveTask();
          }}
        >
          SAVE
        </button>
        <button
          className="btn btn-cancel"
          onClick={() => {
            doCancelTask();
          }}
        >
          CANCEL
        </button>
      </div>
    </div>
  );
}
