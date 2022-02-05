import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ClickAwayListener,
} from "@material-ui/core";
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
} from "../../state/slices/TasksSlice";
import { Popper } from "@mui/material";
import { SectionMoreOptions } from "../section-more-options/SectionMoreOptions";
import { AddNewTask } from "../new-task-btn/AddNewTask";
import { Alert } from "../alert/Alert";

export default (props) => {
  let tasks = useSelector(selectTasksAsobj);
  let tags = useSelector(selectTagsAsObj);
  let todaysTaskIdsObj = getObjFromArr(useSelector(selectTodaysTaskIds));

  let completedTasks = useSelector(
    selectCompletedTaskInProject(props.projectId, props.section._id)
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
          sectionId: props.section._id,
        })
      );
    } else {
      dispatch(
        markTaskAsInCompleteThunk({
          task,
          container: "projects",
          projectId: props.projectId,
          sectionId: props.section._id,
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

  const onEditSection = useCallback((e) => {});

  if (props.section) {
    let section = props.section;

    return (
      <div className={`${styles["section"]}`}>
        <Accordion
          elevation={0}
          onChange={(e) => setExpanded(!expanded)}
          expanded={props.open || (!props.isDragging && expanded)}
        >
          <AccordionSummary
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
                        deleteSection={() => props.onDelete && props.onDelete()}
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
                droppableId={SECTION_DROPPABLE_ID + section._id}
                type="task"
              >
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {props.section.to.map((item, index) => (
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
                        doRemoveTask={props.doRemoveTask}
                      ></DraggableTaskItem>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <AddNewTask
                onSave={addTaskToSection}
                defaultProjectId={props.projectId}
                defaultSectionId={props.section._id}
                viewOnlyProject={true}
              />
              {props.showCompletedSection && (
                <CompletedTasksList
                  tasks={completedTasks}
                  projectId={props.projectId}
                  sectionId={props.section._id}
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
