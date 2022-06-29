import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import AuthService from "../../API/network/AuthService";
import { selectTagsAsObj } from "../../state/selectors";
import { generateUniqueId } from "../../utils/common";
import EstimatedPomos from "../estimate-pomos/EstimatedPomos";
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

export default function EditTaskContainerMobile(props) {
  let taskToBeEdited = props.task || {};

  let tags = useSelector(selectTagsAsObj);

  let ref = useRef(null);

  let [title, setTitle] = useState(taskToBeEdited.title || "");
  let [priority, setPriority] = useState(taskToBeEdited.priority || -1);
  let [description, setDescription] = useState(
    taskToBeEdited.description || ""
  );
  let schedule = taskToBeEdited.schedule || new Date();
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

  let [selectedTags, setSelectedTags] = useState(taskToBeEdited.labels || []);

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

  let resetContainer = (taskToBeEdited) => {
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
  };

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
      }

      resetContainer({});

      props.saveTask(task);
    }

    // setTitle('');
    // setPriority(2);
    // setDescription('');
    // setShowTitleInput(true);
  };

  let doCancelTask = () => {
    props.saveTask({});
  };

  const onTitleInput = (e) => {
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
  };

  const onTitleKeyChange = (e) => {
    if (e.key === "Enter" && title) {
      doSaveTask();
      e.stopPropagation();
    }
  };

  const getTaskTags = () => {
    return (
      <div className={styles["task-tags-list"]}>
        {selectedTags.map((item, ind) => (
          <span
            key={ind}
            className={styles["task-tag-item"]}
            style={{ color: tags[item].color }}
          >
            #{tags[item].title}
            {/* <Close className={styles['close']} style={{width: '12px'}} onClick={(e) => removeTag(item)} /> */}
          </span>
        ))}
      </div>
    );
  };

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

        {/* <div className={styles["description"]}>
          <TaskDescription
            onChange={(e) => setDescription(e)}
            isBulleted={isBulleted}
            value={description}
          />
        </div> */}

        <div className={styles["cta-row"] + " " + styles["cta-row-mobile"]}>
          <div className={styles["estimated-pomos"]}>
            <span className={styles["estimated-pomos-text"]}>
              Estimated Pomodoros:{" "}
            </span>
            <div className={styles["estimated-pomos-container"]}>
              <EstimatedPomos
                default="5"
                value={estimatedPomos}
                hideAdd={true}
                onClick={(value) => {
                  setEstimatedPomos(value);
                }}
              />
            </div>
          </div>
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
