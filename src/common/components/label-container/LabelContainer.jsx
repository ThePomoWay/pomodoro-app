import { Delete, Edit, Label, MoreHorizRounded } from "@material-ui/icons";
import styles from "./LabelContainer.module.scss";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectTagsAsObj, selectTasksFromTag } from "../../state/selectors";
import UndraggableList from "../undraggable-list/UndraggableList";
import { ClickAwayListener, Popper } from "@mui/material";
import { useCallback, useState } from "react";
import { MoreOptions } from "../more-options/MoreOptions";
import { deleteTagThunk, setEditTagId } from "../../state/slices/TagsSlice";
import { setLabelModalState } from "../../state/slices/GlobalSlice";
import { Alert } from "../alert/Alert";

const moreOptions = [
  {
    icon: <Edit />,
    text: "Edit label name",
  },
  {
    icon: <Delete />,
    text: "Delete label",
  },
];

export default function LabelContainer(props) {
  let { labelId } = useParams();
  let labelsObj = useSelector(selectTagsAsObj);

  let [moreAnchorEl, setMoreAnchorEl] = useState(null);
  let [showAlert, setShowAlert] = useState(false);

  let tasks = useSelector(selectTasksFromTag(labelId));

  let dispatch = useDispatch();

  const onOptionClick = useCallback((index) => {
    if (index === 0) {
      dispatch(setEditTagId(labelId));
      dispatch(setLabelModalState(true));
    }
    if (index === 1) {
      setShowAlert(true);
      setMoreAnchorEl(null);
    }
  });

  const onMoreClose = useCallback(() => {
    setMoreAnchorEl(null);
  });

  const openPopper = useCallback((e) => {
    setMoreAnchorEl(e.currentTarget);
  });

  const onDeleteLabel = useCallback((e) => {
    dispatch(deleteTagThunk(labelsObj[labelId]));
    setShowAlert(false);
  });

  if (!labelsObj[labelId]) {
    return <div>No tasks found with this label.</div>;
  }

  return (
    <div className={styles["container"]}>
      <Alert
        title="Are you sure you want to delete this Label?"
        description="This Label will be permanently deleted. Tasks of the label however won't be deleted."
        onClose={(e) => setShowAlert(false)}
        onSuccess={onDeleteLabel}
        showModal={showAlert}
      />
      <div className={styles["header"]}>
        <p className="font-title">{labelsObj[labelId].title}</p>
        <ClickAwayListener onClickAway={onMoreClose}>
          <div>
            <MoreHorizRounded
              style={{ fill: "#7586E3", cursor: "pointer" }}
              onClick={openPopper}
            />
            <Popper
              open={Boolean(moreAnchorEl)}
              id="project-popover"
              anchorEl={moreAnchorEl}
              onClose={onMoreClose}
              position="bottom-left"
            >
              <MoreOptions items={moreOptions} onClick={onOptionClick} />
            </Popper>
          </div>
        </ClickAwayListener>
      </div>
      <UndraggableList tasks={tasks} />
    </div>
  );
}
