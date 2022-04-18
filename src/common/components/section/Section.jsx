import { ClickAwayListener } from "@material-ui/core";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import {
  ExpandMoreOutlined,
  Menu,
  MenuBookOutlined,
  MoreHorizRounded,
} from "@material-ui/icons";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCompletedTaskInProject,
  selectEditTaskRef,
  selectTagsAsObj,
  selectTasksAsobj,
  selectTodaysTaskIds,
} from "../../state/selectors";
import { SECTION_DROPPABLE_ID } from "../../utils/droppable-ids";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { DraggableTaskItem } from "../draggable-task/DraggableTask";
import EditTaskContainer from "../new-task-modal/EditTaskContainer";

import styles from "./Section.module.scss";
import { getObjFromArr } from "../../utils/common";
import CompletedTasksList from "../completed-tasks-collapsible/CompletedTasksList";
import {
  markTaskAsCompleteThunk,
  markTaskAsInCompleteThunk,
  updateTaskThunk,
} from "../../state/thunks/TasksThunk";
import { setEditTask } from "../../state/slice/TasksSlice";
import { Popper } from "@mui/material";
import { SectionMoreOptions } from "../section-more-options/SectionMoreOptions";
import { AddNewTask } from "../new-task-btn/AddNewTask";
import { Alert } from "../alert/Alert";

export default (props) => {
  let tasks = useSelector(selectTasksAsobj);
  let tags = useSelector(selectTagsAsObj);
  let todaysTaskIdsObj = getObjFromArr(useSelector(selectTodaysTaskIds));

  let editTaskRef = useSelector(selectEditTaskRef);

  let completedTasks = useSelector(
    selectCompletedTaskInProject(props.projectId, props.section.secID)
  );

  let dispatch = useDispatch();

  let [showEditTaskContainer, setShowEditTaskContainer] = useState(false);
  let [expanded, setExpanded] = useState(!!props.defaultExpanded);
  let [moreAnchorEl, setMoreAnchorEl] = useState(null);
  let [showDeleteModal, setShowDeleteModal] = useState(false);

  const addTaskToSection = useCallback((task) => {
    props.onAddTask && props.onAddTask(task, props.section);
    setShowEditTaskContainer(false);
  });

  const doCompleteTask = useCallback((task) => {
    if (!task.isComplete) {
      dispatch(
        markTaskAsCompleteThunk({
          task,
          container: "projects",
          projectId: props.projectId,
          sectionId: props.section.secID,
        })
      );
    } else {
      dispatch(
        markTaskAsInCompleteThunk({
          task,
          container: "projects",
          projectId: props.projectId,
          sectionId: props.section.secID,
        })
      );
    }
  });

  const onMoreClose = useCallback(() => {
    setMoreAnchorEl(null);
  });

  const onMoreClick = useCallback((e) => {
    setMoreAnchorEl(e.currentTarget);
    e.stopPropagation();
  });

  let doSaveTask = (task) => {
    if (task && task.fid) {
      dispatch(updateTaskThunk(task));
    }
    dispatch(setEditTask(""));
  };

  let doEditTask = (task) => {
    if (task && task.fid) {
      dispatch(setEditTask(task.fid));
    }
  };

  const onEditSection = useCallback((e) => {
    e.stopPropagation();
  });

  if (props.section) {
    let section = props.section;

    return (
      <div className={`${styles["section"]}`}>
        <Accordion
          elevation={0}
          onChange={(e) => setExpanded(!expanded)}
          defaultExpanded={true}
          expanded={props.open || (!props.isDragging && expanded)}
        >
          <AccordionSummary
            sx={{ flexDirection: "row-reverse" }}
            expandIcon={<ExpandMoreOutlined style={{ fill: "#4D61D1" }} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <div className={styles["section-title"]}>
              <h2>{section.title}</h2>
              <div className={styles["right"]}>
                <span
                  {...props.dragHandleProps}
                  className={styles["hamburger"]}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line x1="6" y1="7.5" x2="19" y2="7.5" stroke="#7586E3" />
                    <line x1="6" y1="11.5" x2="19" y2="11.5" stroke="#7586E3" />
                    <line x1="6" y1="15.5" x2="19" y2="15.5" stroke="#7586E3" />
                  </svg>
                </span>
                <ClickAwayListener onClickAway={onMoreClose}>
                  <div>
                    <MoreHorizRounded
                      style={{ fill: "#4D61D1" }}
                      onClick={onMoreClick}
                    />
                    <Popper
                      open={Boolean(moreAnchorEl)}
                      id="project-popover"
                      anchorEl={moreAnchorEl}
                      onClose={onMoreClose}
                      position="bottom-left"
                    >
                      <SectionMoreOptions
                        editSection={onEditSection}
                        deleteSection={(e) =>
                          props.onDelete && props.onDelete(e)
                        }
                      />
                    </Popper>
                  </div>
                </ClickAwayListener>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className={styles["section-task-list"]}>
              <Droppable
                droppableId={SECTION_DROPPABLE_ID + section.secID}
                type="task"
              >
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {props.section.to.map((item, index) => {
                      return (
                        (item === editTaskRef && (
                          <div className={styles["edit-task-container"]}>
                            <EditTaskContainer
                              defaultProjectId={props.projectId}
                              defaultSectionId={props.section.secID}
                              saveTask={doSaveTask}
                              task={tasks[item]}
                            />
                          </div>
                        )) || (
                          <DraggableTaskItem
                            showAddBtn={!(item in todaysTaskIdsObj)}
                            showRemoveBtn={item in todaysTaskIdsObj}
                            tags={tags}
                            task={tasks[item]}
                            key={item}
                            index={index}
                            dropId={"task-"}
                            doAddTask={props.doAddTask}
                            onComplete={doCompleteTask}
                            projects={props.projects}
                            doRemoveTask={props.doRemoveTask}
                            onClick={doEditTask}
                            hideWorkingOn={true}
                          ></DraggableTaskItem>
                        )
                      );
                    })}
                    {(!props.section.to || !props.section.to.length) && (
                      <div style={{ width: "100%", height: "20px" }}></div>
                    )}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <div className={styles["add-new-task"]}>
                <AddNewTask
                  onSave={addTaskToSection}
                  defaultProjectId={props.projectId}
                  defaultSectionId={props.section.secID}
                  viewOnlyProject={true}
                  variant="btn-save-2"
                />
              </div>
              {props.showCompletedSection && (
                <CompletedTasksList
                  tasks={completedTasks}
                  projectId={props.projectId}
                  sectionId={props.section.secID}
                  container="projects"
                />
              )}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }

  return <div>Loading...</div>;
};
