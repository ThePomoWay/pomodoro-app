import { useDispatch, useSelector } from "react-redux";
import {
  selectCompletedTaskInProject,
  selectEditTaskRef,
  selectFreeProjects,
  selectHideProjectsCompletedTasks,
  selectProjectById,
  selectProjectsObj,
  selectTagsAsObj,
  selectTasksAsobj,
  selectTodaysTaskIds,
  selectUserInfo,
} from "../../state/selectors";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useHistory, useParams } from "react-router-dom";
import { setEditProjectId } from "../../state/slice/ProjectSlice";
import { setEditTask } from "../../state/slice/TasksSlice";
import {
  createSectionAsync,
  deleteProjectAsync,
  deleteSectionAsync,
  rearrangeTaskInProjectAsync,
  updateLocalProjectAsync,
  updateProjectAsync,
} from "../../state/thunks/ProjectThunk";
import {
  addToTodaysTasks,
  markTaskAsCompleteThunk,
  markTaskAsInCompleteThunk,
  removeFromTodaysTasks,
  updateLocalTaskThunk,
  updateTaskThunk,
} from "../../state/thunks/TasksThunk";
import { PROJECT_DROPPABLE_ID } from "../../utils/droppable-ids";
import { DraggableTaskItem } from "../draggable-task/DraggableTask";
import SectionList from "../section-list/SectionList";

import { ClickAwayListener, Popper } from "@material-ui/core";
import { MoreHorizRounded } from "@material-ui/icons";
import {
  setLastAllTaskUrl,
  setProjectModalState,
} from "../../state/slice/GlobalSlice";
import { toggleHideProjectsCompletedTasks } from "../../state/thunks/GlobalThunk";
import { getObjFromArr } from "../../utils/common";
import {
  SUBSCRIPTION_STATUS_ACTIVE,
  SUBSCRIPTION_STATUS_PAST_DUE,
} from "../../utils/constants";
import { Alert } from "../alert/Alert";
import CompletedTasksList from "../completed-tasks-collapsible/CompletedTasksList";
import { AddNewTask } from "../new-task-btn/AddNewTask";
import EditTaskContainer from "../new-task-modal/EditTaskContainer";
import styles from "./ProjectContainer.module.scss";
import { ProjectMoreOptions } from "../project-more-options/ProjectMoreOptions";

export function ProjectContainer(props) {
  let { projectId } = useParams();

  let projectsObj = useSelector(selectProjectsObj);
  let freeProjects = useSelector(selectFreeProjects);
  let disableTaskCreation = true;
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
  let user = useSelector(selectUserInfo);

  let [isDragging, setIsDragging] = useState(false);
  let [isTaskDragging, setIsTaskDragging] = useState(false);

  let showCompletedSection = useSelector(selectHideProjectsCompletedTasks);

  let editTaskRef = useSelector(selectEditTaskRef);

  let [showAlert, setShowAlert] = useState(false);

  let [defaultExpandedSectionId, setDefaultExpandedSectionId] = useState("");

  if (
    user.subscription &&
    (user.subscription.status === SUBSCRIPTION_STATUS_ACTIVE ||
      user.subscription.status === SUBSCRIPTION_STATUS_PAST_DUE)
  ) {
    disableTaskCreation = false;
  } else {
    for (var i = 0; i < freeProjects.length; i++) {
      if (freeProjects[i]._id === projectId) {
        disableTaskCreation = false;
        break;
      }
    }
  }

  if (
    user.subscription &&
    (user.subscription.status == SUBSCRIPTION_STATUS_ACTIVE ||
      user.subscription.status == SUBSCRIPTION_STATUS_PAST_DUE)
  ) {
    disableTaskCreation = false;
  } else {
    for (var i = 0; i < freeProjects.length; i++) {
      if (freeProjects[i]._id === projectId) {
        disableTaskCreation = false;
        break;
      }
    }
  }

  const addTaskToProject = (task) => {
    if (task.fid) {
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

  const onSectionCreate = (section) => {
    dispatch(createSectionAsync({ project: projectVar, section }));
  };

  const onAddTaskToSection = (task, section) => {
    // dispatch(createTaskThunk({ task }));
    dispatch(
      updateLocalProjectAsync({
        ...projectVar,
        sections: {
          ...projectVar.sections,
          [section.secID]: {
            ...section,
            to: [...section.to, task.fid],
          },
        },
      })
    );
  };

  const onDragEnd = (result) => {
    if (result.source && result.destination) {
      if (result.type === "section") {
        let sectionOrderCopy = JSON.parse(JSON.stringify(projectVar.so));

        let sid = sectionOrderCopy.splice(result.source.index, 1)[0];
        sectionOrderCopy.splice(result.destination.index, 0, sid);

        dispatch(
          updateProjectAsync({
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
            source.hid = projectCopy.sections[sectionId].secID;
            source.to = projectCopy.sections[sectionId].to;
          }
        }

        let taskId = result.draggableId.split("task-")[1];
        if (result.destination.droppableId === PROJECT_DROPPABLE_ID) {
          projectCopy.to.splice(result.destination.index, 0, taskId);

          destination.hid = projectCopy._id;
          destination.to = projectCopy.to;

          dispatch(
            updateLocalTaskThunk({
              ...tasks[taskId],
              project: {
                projectID: projectCopy._id,
                secID: "",
              },
            })
          );
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
            destination.hid = projectCopy.sections[sectionId].secID;
            destination.to = projectCopy.sections[sectionId].to;
          }
          setDefaultExpandedSectionId(sectionId);
          dispatch(
            updateLocalTaskThunk({
              ...tasks[taskId],
              project: {
                projectID: projectCopy._id,
                secID: sectionId,
              },
            })
          );
        }

        source.to = source.to.map((item) => tasks[item] && tasks[item]._id);
        destination.to = destination.to.map(
          (item) => tasks[item] && tasks[item]._id
        );

        dispatch(
          rearrangeTaskInProjectAsync({
            body: {
              source,
              destination,
              taskId: tasks[taskId]._id,
              projectId: projectCopy._id,
              isSame: destination.hid === source.hid,
            },
            project: projectCopy,
          })
        );
        // dispatch(updateLocalProjectAsync(projectCopy));
      }
    }

    setIsDragging(false);
    setIsTaskDragging(false);
  };

  const onBeforeDragStart = (res) => {
    if (!res.draggableId.startsWith("task-")) {
      setIsDragging(true);
    } else {
      setIsTaskDragging(true);
    }
  };

  const doAddTask = (task) => {
    dispatch(addToTodaysTasks({ fid: task.fid, _id: task._id }));
  };

  const doRemoveTask = (task) => {
    dispatch(
      removeFromTodaysTasks({
        fid: task.fid,
        _id: task._id,
      })
    );
  };

  const doCompleteTask = (task) => {
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
  };

  let [moreAnchorEl, setMoreAnchorEl] = useState(null);
  const onMoreAnchorClick = (e) => {
    setMoreAnchorEl(e.currentTarget);
    e.stopPropagation();
  };

  const onMoreClose = (e) => {
    setMoreAnchorEl(null);
    e && e.stopPropagation();
  };

  const openProjectModal = (e) => {
    dispatch(setProjectModalState(true));
    dispatch(setEditProjectId(projectVar._id));
  };

  const toggleCompletedTasks = (e) => {
    dispatch(toggleHideProjectsCompletedTasks());
    //setShowCompletedSection(!showCompletedSection);
    onMoreClose();
  };

  let history = useHistory();

  const onDeleteProject = (e) => {
    dispatch(
      deleteProjectAsync({ project: projectVar, allProjects: projectsObj })
    );
    setShowAlert(false);
    setMoreAnchorEl(null);
    setTimeout(() => {
      history.push("/all");
    }, 1000);
  };

  let doSaveTask = (task) => {
    if (task && task.fid) {
      dispatch(updateTaskThunk(task));
    }
    dispatch(setEditTask(""));
  };

  let doEditTask = (task) => {
    dispatch(setEditTask(task.fid));
  };

  let deleteSection = (sectionId) => {
    dispatch(deleteSectionAsync({ projectId: projectVar._id, sectionId }));
  };

  useEffect(() => {
    dispatch(setLastAllTaskUrl(window.location.pathname));
  }, [dispatch]);

  if (projectVar) {
    // let totalTasks = projectVar.to.length;
    // for (let sectionId of projectVar.so) {
    //   totalTasks += projectVar.sections[sectionId].to.length;
    // }

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
                    {(projectVar.to && projectVar.to.length > 0 && (
                      <div className={styles["task-list"]}>
                        {projectVar.to.map((item, index) => {
                          return (
                            (item === editTaskRef && (
                              <div
                                className={styles["edit-task-container"]}
                                key={"task-edit-" + index}
                              >
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
                                onClick={doEditTask}
                                dropId={"task-"}
                                projects={projectsObj}
                                hideWorkingOn={true}
                              ></DraggableTaskItem>
                            )
                          );
                        })}
                      </div>
                    )) || <div style={{ width: "100%", height: "20px" }}></div>}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div className={styles["project-add-new-task"]}>
              <AddNewTask
                disableTaskCreation={disableTaskCreation}
                onSave={(a) => addTaskToProject(a)}
                defaultProjectId={projectVar._id}
                viewOnlyProject={true}
                variant="btn-save-2"
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
              scroll={props.scroll}
              onSectionDelete={deleteSection}
            />
          ) || (
            <div className="flex flex-center">
              <img src="/project-empty.jpg" alt="Project is empty" />
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
