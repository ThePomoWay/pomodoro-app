import { Close, Done } from "@material-ui/icons";
import { Modal } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEditTagId,
  selectNewLabelModal,
  selectTagsAsObj,
} from "../../state/selectors";
import { setLabelModalState } from "../../state/slices/GlobalSlice";
import { createTagThunk, updateTagThunk } from "../../state/slices/TagsSlice";
import { generateUniqueId } from "../../utils/common";
import { tagColorPalette } from "../../utils/constants";
import AddTagContainer from "../add-tag-container/AddTagContainer";
import styles from "./NewLabelContainer.module.scss";

export default function NewLabelContainer(props) {
  let isModalOpen = useSelector(selectNewLabelModal);
  let editTagId = useSelector(selectEditTagId);
  let tags = useSelector(selectTagsAsObj);

  let [tagValue, setTagValue] = useState("");
  let [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    if (editTagId) {
      setTagValue(tags[editTagId].title);
    }
  }, [editTagId]);

  let dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(setLabelModalState(false));
  });

  const saveTag = useCallback(() => {
    let color =
      (selectedIndex !== -1 && tagColorPalette[selectedIndex]) || "gray";
    if (tagValue) {
      if (editTagId) {
        dispatch(
          updateTagThunk({
            ...tags[editTagId],
            title: tagValue,
            color,
          })
        );
      } else {
        dispatch(
          createTagThunk({
            fid: generateUniqueId(),
            title: tagValue,
            color,
          })
        );
      }
      dispatch(setLabelModalState(false));
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
        <div className="modal-title">
          <p>Create a label</p>
          <Close style={{ cursor: "pointer" }} onClick={handleClose} />
        </div>
        <input
          className={styles["input"]}
          placeholder="Type label name here..."
          value={tagValue}
          onChange={(e) => setTagValue(e.target.value)}
        />
        <div className={styles["color-container"]}>
          <p className={styles["label"]}>Choose Colour:</p>
          <div className={styles["color-palette"]}>
            {tagColorPalette.map((item, index) => (
              <span
                onClick={(e) => setSelectedIndex(index)}
                style={{ backgroundColor: item }}
                className="circle-simple flex flex-center"
                key={"color" + index}
              >
                {selectedIndex === index && (
                  <Done style={{ width: "0.6em", fill: "white" }}></Done>
                )}
              </span>
            ))}
          </div>
        </div>
        <div className={styles["cta"]}>
          <button className="btn btn-cancel" onClick={handleClose}>
            CANCEL
          </button>
          <button className="btn btn-save" onClick={saveTag}>
            SAVE
          </button>
        </div>
      </div>
    </Modal>
  );
}
