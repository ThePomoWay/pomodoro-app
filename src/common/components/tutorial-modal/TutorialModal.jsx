import { ChevronRight } from "@material-ui/icons";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTutorialModal } from "../../state/selectors";
import { closeTutorialModal } from "../../state/slice/GlobalSlice";
import { CloseIcon } from "../../svgs/CloseIcon";
import { TickIcon } from "../../svgs/TickIcon";
import { ProgressStrip } from "./ProgressStrip";
import styles from "./TutorialModal.module.scss";

import { ReactComponent as TickWhite } from "../../svgs/TickWhite.svg";

let STEP_DETAILS = [
  {
    title: "Plan Everyday in Advance",
    description:
      "Create Task. Estimate lenght in pomodoros. Press play to start timer.",
  },
  {
    title: "Don’t let tasks slide",
    description:
      "Keep your tasks organished with projects, labels and priorities. Press '+' to add to today's list.",
  },
  {
    title: "Focus Better",
    description:
      "Don't let social media get to you. Focus better by blocking all distractions.",
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
            <CloseIcon width="30" height="30" />
          </span>
          <div className={styles["container"]}>
            <div className={styles["left"]}>
              <div className={styles["first"]}>
                <div className={styles["title"]}>
                  {STEP_DETAILS[step].title}
                </div>
                <div className={styles["description"]}>
                  {STEP_DETAILS[step].description}
                </div>
              </div>

              <div className={styles["second"]}>
                <div className={styles["btn"]} onClick={(e) => nextStep()}>
                  {step < 2 && (
                    <ChevronRight
                      style={{ color: "white", width: "50%", height: "50%" }}
                    />
                  )}
                  {step == 2 && <TickWhite />}
                </div>

                <ProgressStrip selected={step} onChange={(e) => setStep(e)} />
              </div>
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
