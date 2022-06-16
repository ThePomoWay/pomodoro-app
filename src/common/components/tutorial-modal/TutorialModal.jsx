import { ChevronRight } from "@material-ui/icons";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTutorialModal } from "../../state/selectors";
import { closeTutorialModal } from "../../state/slice/GlobalSlice";
import { CloseIcon } from "../../svgs/CloseIcon";
import { ProgressStrip } from "./ProgressStrip";
import styles from "./TutorialModal.module.scss";

let STEP_DETAILS = [
  {
    title: "Plan Your Day",
    description:
      "Are your deadlines overwhelming you? Timedojo gives you the right push to get started on your daily tasks list for the day. We use the proven Pomodoro technique to improve work quality & time management. ",
  },
  {
    title: "Don’t let tasks slide",
    description:
      "Are your deadlines overwhelming you? Timedojo gives you the right push to get started on your daily tasks list for the day. We use the proven Pomodoro technique to improve work quality & time management. ",
  },
  {
    title: "Focus Better",
    description:
      "Are your deadlines overwhelming you? Timedojo gives you the right push to get started on your daily tasks list for the day. We use the proven Pomodoro technique to improve work quality & time management. ",
  },
];

export function TutorialModal(props) {
  let isModalOpen = useSelector(selectTutorialModal);
  let dispatch = useDispatch();

  let handleClose = () => {
    dispatch(closeTutorialModal());
  };

  let [step, setStep] = useState(0);

  let nextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      dispatch(closeTutorialModal());
    }
  };
  return (
    <Modal
      open={isModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="modal-container big-modal">
        <div className="modal-content">
          <span className="close" onClick={(e) => handleClose()}>
            <CloseIcon />
          </span>
          <div className={styles["container"]}>
            <div className={styles["left"]}>
              <div className={styles["title"]}>{STEP_DETAILS[step].title}</div>
              <div className={styles["description"]}>
                {STEP_DETAILS[step].description}
              </div>
              <div className={styles["btn"]} onClick={(e) => nextStep()}>
                <ChevronRight style={{ color: "white" }} />
              </div>
              <ProgressStrip selected={step} />
            </div>

            <div className={styles["right"]}>
              <img className={styles["img"]} src="landing-img.png" />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
