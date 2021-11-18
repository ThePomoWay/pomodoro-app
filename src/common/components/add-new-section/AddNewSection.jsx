
import { useCallback, useState } from "react";
import { generateUniqueId } from "../../utils/common";
import styles from "./AddNewSection.module.scss";

export default (props) => {

    let [showEditSection, setShowEditSection] = useState(false);
    let [sectionTitle, setSectionTitle] = useState('');

    const onSaveSection = useCallback(() => {
        props.onSave && props.onSave({
            index: props.index,
            title: sectionTitle,
            fid: generateUniqueId(),
            taskOrder: [],
            completedTaskOrder: []
        });
        setShowEditSection(false)
    })

    if(!showEditSection) {
        return (
            <div className={`${styles["new-section"]} ${props.showOnHover && styles['hover']}`} onClick={(e) => setShowEditSection(true)}>
                <div className={styles["border"]}></div>
                <span className={styles["title"]}>+ Add a section</span>
            </div>
        )
    }

    return (
        <div className={styles['edit-section']}>
            <textarea className={styles['edit-input']} value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)} />
            <button className={`${styles["save-btn"]} btn btn-simple`} onClick={(e) => onSaveSection()}>Save Section</button>
            <button className="btn btn-simple btn-simple-light" onClick={(e) => setShowEditSection(false)}>Cancel</button>
        </div>
    )
}