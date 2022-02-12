import { useDispatch, useSelector } from "react-redux";
import {
  selectCompletedTaskInProject,
  selectProjectById,
  selectProjectsObj,
  selectTagsAsObj,
  selectTasksAsobj,
  selectTodaysTaskIds,
  selectEditTaskRef,
} from "../../state/selectors";

import { useParams, useHistory } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { DraggableTaskItem } from "../draggable-task/DraggableTask";
import SectionList from "../section-list/SectionList";
import {
  createSectionAsync,
  deleteProjectAsync,
  rearrangeTaskInProjectAsync,
  setEditProjectId,
  updateLocalProjectAsync,
} from "../../state/slices/ProjectSlice";
import {
  addToTodaysTasks,
  createTaskThunk,
  markTaskAsCompleteThunk,
  markTaskAsInCompleteThunk,
  removeFromTodaysTasks,
  updateTaskThunk,
  setEditTask,
} from "../../state/slices/TasksSlice";
import { PROJECT_DROPPABLE_ID } from "../../utils/droppable-ids";

import styles from "./ProjectContainer.module.scss";
import { getObjFromArr } from "../../utils/common";
import CompletedTasksList from "../completed-tasks-collapsible/CompletedTasksList";
import { AddNewTask } from "../new-task-btn/AddNewTask";
import { MoreHorizRounded } from "@material-ui/icons";
import { ClickAwayListener, Popper } from "@material-ui/core";
import { ProjectMoreOptions } from "../project-more-options/ProjectMoreOptions";
import { setProjectModalState } from "../../state/slices/GlobalSlice";
import { Alert } from "../alert/Alert";
import EditTaskContainer from "../new-task-modal/EditTaskContainer";

export function ProjectContainer(props) {
  let { projectId } = useParams();

  let projectsObj = useSelector(selectProjectsObj);
  let tags = useSelector(selectTagsAsObj);
  let todaysTaskIds = useSelector(selectTodaysTaskIds);
  let todaysTaskIdsObj = getObjFromArr(todaysTaskIds);
  let completedTasks = useSelector(
    selectCompletedTaskInProject(
      projectsObj[projectId] && projectsObj[projectId]._id,
      ""
    )
  );

  let dispatch = useDispatch();

  let tasks = useSelector(selectTasksAsobj);

  let [showEditTaskContainer, setShowEditTaskContainer] = useState(false);
  let [isDragging, setIsDragging] = useState(false);
  let [isTaskDragging, setIsTaskDragging] = useState(false);
  let [showCompletedSection, setShowCompletedSection] = useState(false);

  let editTaskRef = useSelector(selectEditTaskRef);

  let [showAlert, setShowAlert] = useState(false);

  let [defaultExpandedSectionId, setDefaultExpandedSectionId] = useState("");

  let a = Date.now();

  const addTaskToProject = (task) => {
    if (task.fid) {
      console.log(a);
      // dispatch(createTaskThunk({ task }));
      dispatch(
        updateLocalProjectAsync({
          ...projectVar,
          to: [...projectVar.to, task.fid],
        })
      );
    }
  };
  let projectVar = useSelector(selectProjectById(projectId));

  const onSectionCreate = useCallback((section) => {
    dispatch(createSectionAsync({ project: projectVar, section }));
  });

  const onAddTaskToSection = useCallback((task, section) => {
    // dispatch(createTaskThunk({ task }));
    dispatch(
      updateLocalProjectAsync({
        ...projectVar,
        sections: {
          ...projectVar.sections,
          [section._id]: {
            ...section,
            to: [...section.to, task.fid],
          },
        },
      })
    );
  });

  const onDragEnd = useCallback((result) => {
    if (result.source && result.destination) {
      if (result.type === "section") {
        let sectionOrderCopy = JSON.parse(JSON.stringify(projectVar.so));

        let sid = sectionOrderCopy.splice(result.source.index, 1);
        sectionOrderCopy.splice(result.destination.index, 0, sid);

        dispatch(
          updateLocalProjectAsync({
            ...projectVar,
            so: sectionOrderCopy,
          })
        );
      } else {
        let projectCopy = JSON.parse(JSON.stringify(projectVar));

        let source = {
          isSection: false,
          hid: "",
          to: [],
        };
        let destination = {
          isSection: false,
          hid: "",
          to: [],
        };

        if (result.source.droppableId === PROJECT_DROPPABLE_ID) {
          projectCopy.to.splice(result.source.index, 1);
          source.hid = projectCopy._id;
          source.to = projectCopy.to;
        } else {
          let sectionId =
            result.source.droppableId.split("section-droppable-")[1];
          if (projectCopy.sections[sectionId]) {
            projectCopy.sections[sectionId].to.splice(result.source.index, 1);

            source.isSection = true;
            source.hid = projectCopy.sections[sectionId]._id;
            source.to = projectCopy.sections[sectionId].to;
          }
        }

        let taskId = result.draggableId.split("task-")[1];
        if (result.destination.droppableId === PROJECT_DROPPABLE_ID) {
          projectCopy.to.splice(result.destination.index, 0, taskId);

          destination.hid = projectCopy._id;
          destination.to = projectCopy.to;
        } else {
          let sectionId =
            result.destination.droppableId.split("section-droppable-")[1];
          if (projectCopy.sections[sectionId]) {
            projectCopy.sections[sectionId].to.splice(
              result.destination.index,
              0,
              taskId
            );

            destination.isSection = true;
            destination.hid = projectCopy.sections[sectionId]._id;
            destination.to = projectCopy.sections[sectionId].to;
          }
          setDefaultExpandedSectionId(sectionId);
        }

        source.to = source.to.map((item) => tasks[item] && tasks[item]._id);
        destination.to = destination.to.map(
          (item) => tasks[item] && tasks[item]._id
        );

        dispatch(
          rearrangeTaskInProjectAsync({
            source,
            destination,
            taskId: tasks[taskId]._id,
            projectId: projectCopy._id,
            isSame: destination.hid === source.hid,
          })
        );
        dispatch(updateLocalProjectAsync(projectCopy));
      }
    }

    setIsDragging(false);
    setIsTaskDragging(false);
  });

  const onBeforeDragStart = useCallback((res) => {
    if (!res.draggableId.startsWith("task-")) {
      setIsDragging(true);
    } else {
      setIsTaskDragging(true);
    }
  });

  const doAddTask = useCallback((task) => {
    dispatch(addToTodaysTasks({ fid: task.fid, _id: task._id }));
  });

  const doRemoveTask = useCallback((task) => {
    dispatch(
      removeFromTodaysTasks({
        fid: task.fid,
        _id: task._id,
      })
    );
  });

  const doCompleteTask = useCallback((task) => {
    if (!task.isComplete) {
      dispatch(
        markTaskAsCompleteThunk({
          task,
          container: "projects",
          projectId: projectVar._id,
        })
      );
    } else {
      dispatch(
        markTaskAsInCompleteThunk({
          task,
          container: "projects",
          projectId: projectVar._id,
        })
      );
    }
  });

  let [moreAnchorEl, setMoreAnchorEl] = useState(null);
  const onMoreAnchorClick = useCallback((e) => {
    setMoreAnchorEl(e.currentTarget);
    e.stopPropagation();
  });

  const onMoreClose = useCallback((e) => {
    setMoreAnchorEl(null);
    e && e.stopPropagation();
  });

  const openProjectModal = useCallback((e) => {
    dispatch(setProjectModalState(true));
    dispatch(setEditProjectId(projectVar._id));
  });

  const toggleCompletedTasks = useCallback((e) => {
    setShowCompletedSection(!showCompletedSection);
    onMoreClose();
  });

  const onShowAlert = useCallback((e) => {
    setShowAlert(true);
  });

  let history = useHistory();

  const onDeleteProject = useCallback((e) => {
    dispatch(deleteProjectAsync(projectVar));
    setShowAlert(false);
    setMoreAnchorEl(null);
    setTimeout(() => {
      history.push("/all");
    }, 1000);
  });

  let doSaveTask = useCallback((task) => {
    if (task && task.fid) {
      dispatch(updateTaskThunk(task));
    }
    dispatch(setEditTask(""));
  });

  if (projectVar) {
    let totalTasks = projectVar.to.length;
    for (let sectionId of projectVar.so) {
      totalTasks += projectVar.sections[sectionId].to.length;
    }

    return (
      <div className={styles["project-container"]}>
        <Alert
          title="Are you sure you want to delete this project?"
          description="This project will be permanently deleted along with it's tasks"
          onClose={(e) => setShowAlert(false)}
          onSuccess={onDeleteProject}
          showModal={showAlert}
        />
        <div className={styles["title"]}>
          <span>{projectVar.title}</span>
          <span>
            <ClickAwayListener onClickAway={onMoreClose}>
              <div>
                <MoreHorizRounded
                  style={{ fill: "#7586E3", cursor: "pointer" }}
                  onClick={onMoreAnchorClick}
                />
                <Popper
                  open={Boolean(moreAnchorEl)}
                  id="project-popover"
                  anchorEl={moreAnchorEl}
                  onClose={onMoreClose}
                  position="bottom-left"
                >
                  <ProjectMoreOptions
                    onEditProject={openProjectModal}
                    toggleCompletedTasks={toggleCompletedTasks}
                    onDeleteProject={(e) => setShowAlert(true)}
                    showCompletedSection={showCompletedSection}
                  />
                </Popper>
              </div>
            </ClickAwayListener>
          </span>
        </div>
        <DragDropContext
          onBeforeCapture={onBeforeDragStart}
          onDragEnd={onDragEnd}
        >
          <div className={styles["mar-b20"]}>
            <div className={styles["task-container"]}>
              <Droppable droppableId={PROJECT_DROPPABLE_ID} type="task">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {totalTasks > 0 && (
                      <div className={styles["task-list"]}>
                        {projectVar.to.map((item, index) => {
                          return (
                            (item === editTaskRef && (
                              <div className={styles["edit-task-container"]}>
                                <EditTaskContainer
                                  defaultProjectId={projectVar._id}
                                  saveTask={doSaveTask}
                                  task={tasks[item]}
                                />
                              </div>
                            )) || (
                              <DraggableTaskItem
                                showAddBtn={!(item in todaysTaskIdsObj)}
                                showRemoveBtn={item in todaysTaskIdsObj}
                                doAddTask={doAddTask}
                                doRemoveTask={doRemoveTask}
                                tags={tags}
                                task={tasks[item]}
                                key={item}
                                index={index}
                                onComplete={doCompleteTask}
                                // onClick={doEditTask(index)}
                                dropId={"task-" + tasks[item].fid}
                                projects={projectsObj}
                              ></DraggableTaskItem>
                            )
                          );
                        })}
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div className={styles["project-add-new-task"]}>
              <AddNewTask
                onSave={(a) => addTaskToProject(a)}
                defaultProjectId={projectVar._id}
                viewOnlyProject={true}
              />
            </div>

            {showCompletedSection && (
              <div className={styles["completed-task"]}>
                <CompletedTasksList
                  container="projects"
                  projectId={projectVar._id}
                  tasks={completedTasks}
                />
              </div>
            )}
          </div>
          {(
            <SectionList
              order={projectVar.so}
              sections={projectVar.sections}
              onCreateSection={onSectionCreate}
              onAddTaskToSection={onAddTaskToSection}
              isDragging={isDragging}
              doAddTask={doAddTask}
              doRemoveTask={doRemoveTask}
              isTaskDragging={isTaskDragging}
              projectId={projectVar._id || projectVar.fid}
              defaultExpandedSectionId={defaultExpandedSectionId}
              showCompletedSection={showCompletedSection}
              projects={projectsObj}
            />
          ) || (
            <div className="flex flex-center">
              <img src="/project-empty.jpg" />
              <span className="text-small text-gray">
                Create Sections to organize your tasks{" "}
              </span>
            </div>
          )}
        </DragDropContext>
      </div>
    );
  }
  return (
    <div className={styles["project-container"]}>
      <span>Loading...</span>
    </div>
  );
}
