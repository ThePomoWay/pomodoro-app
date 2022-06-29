import { useState } from "react";
import AddNewSection from "../add-new-section/AddNewSection";
import Section from "../section/Section";

import { Draggable, Droppable } from "react-beautiful-dnd";

import { Alert } from "../alert/Alert";
import styles from "./SectionList.module.scss";

export default function SectionList(props) {
  const onCreateSection = (section) =>
    props.onCreateSection && props.onCreateSection(section);
  const onAddTask = (task, section) =>
    props.onAddTaskToSection && props.onAddTaskToSection(task, section);
  let [deleteSectionId, setDeleteSectionId] = useState("");
  let [showDeleteModal, setShowDeleteModal] = useState(false);

  const onDelete = (sectionId) => {
    setDeleteSectionId(sectionId);
    setShowDeleteModal(true);
  };

  const onDeleteSection = (e) => {
    props.onSectionDelete && props.onSectionDelete(deleteSectionId);
    setShowDeleteModal(false);
    setDeleteSectionId("");
  };

  return (
    <div>
      <Alert
        showModal={showDeleteModal}
        onSuccess={onDeleteSection}
        onClose={(e) => setShowDeleteModal(false)}
        title="Are you sure you want to delete this section?"
        description="All tasks in the section will be lost."
      />
      <AddNewSection
        showOnHover={props.order.length > 0}
        onSave={onCreateSection}
        index={0}
        isLastSection={true}
        scroll={props.scroll}
      ></AddNewSection>

      <Droppable droppableId="id-section" type="section">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {props.order &&
              props.sections &&
              props.order.map((item, index) => (
                <Draggable
                  key={props.sections[item].secID}
                  draggableId={props.sections[item].secID}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className={styles["section"]}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                    >
                      <Section
                        open={props.isTaskDragging}
                        section={props.sections[item]}
                        onAddTask={onAddTask}
                        index={index}
                        projectId={props.projectId}
                        isDragging={props.isDragging}
                        doAddTask={props.doAddTask}
                        doRemoveTask={props.doRemoveTask}
                        showCompletedSection={props.showCompletedSection}
                        projects={props.projects}
                        defaultExpanded={
                          // props.defaultExpandedSectionId ===
                          // props.sections[item]._id
                          true
                        }
                        dragHandleProps={provided.dragHandleProps}
                        onDelete={() => onDelete(item)}
                      />

                      <AddNewSection
                        showOnHover={true}
                        onSave={onCreateSection}
                        index={index + 1}
                        isLastSection={index + 1 === props.order.length}
                        scroll={props.scroll}
                      ></AddNewSection>
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
