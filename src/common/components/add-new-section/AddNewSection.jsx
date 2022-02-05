import { useCallback, useState } from "react";
import { AddIcon } from "../../svgs/AddIcon";
import { generateUniqueId } from "../../utils/common";
import styles from "./AddNewSection.module.scss";

export default (props) => {
  let [showEditSection, setShowEditSection] = useState(false);
  let [sectionTitle, setSectionTitle] = useState("");

  const onSaveSection = useCallback(() => {
    props.onSave &&
      props.onSave({
        index: props.index,
        title: sectionTitle,
        fid: generateUniqueId(),
        to: [],
      });
    setShowEditSection(false);
  });

  const onKeyDown = useCallback((e) => {
    e.key === "Enter" && onSaveSection();
  });

  if (!showEditSection) {
    return (
      <div
        className={`${styles["new-section"]} ${
          props.showOnHover && styles["hover"]
        }`}
        onClick={(e) => setShowEditSection(true)}
      >
        <div className={styles["border"]}></div>
        <span className={`${styles["title"]} flex flex-center`}>
          <AddIcon style={{ fill: "#909EEA" }} /> Add a section
        </span>
      </div>
    );
  }

  return (
    <div className={styles["edit-section"]}>
      <textarea
        className={styles["edit-input"]}
        value={sectionTitle}
        placeholder="Type section name here..."
        onChange={(e) => setSectionTitle(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <div className={styles["cta"]}>
        <button
          className="btn btn-cancel"
          onClick={(e) => setShowEditSection(false)}
        >
          CANCEL
        </button>
        <button className="btn btn-save" onClick={(e) => onSaveSection()}>
          SAVE
        </button>
      </div>
    </div>
  );
};
