import { ChevronRight } from "@material-ui/icons";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTutorialModal } from "../../state/selectors";
import { closeTutorialModal } from "../../state/slice/GlobalSlice";
import { CloseIcon } from "../../svgs/CloseIcon";
import { ProgressStrip } from "./ProgressStrip";
import styles from "./TutorialModal.module.scss";

import { ReactComponent as TickWhite } from "../../svgs/TickWhite.svg";
import { LANDING_PAGE_CLOSE } from "../../utils/constants";

let STEP_DETAILS = [
  {
    title: "Plan Everyday in Advance",
    description: (
      <>
        1. Create Task. <br /> 2. Estimate length in pomodoros. <br /> 3. Press
        play to start timer.
      </>
    ),
    video: "create_task.mp4",
  },
  {
    title: "Don’t let tasks slide",
    description:
      "Keep your tasks organished with projects, labels and priorities. Press '+' to add to today's list.",
    video: "Project.mp4",
  },
  {
    title: "Focus Better",
    description:
      "Don't let social media get to you. Focus better by blocking all distractions.",
    video: "Focus.mp4",
  },
];

export function TutorialModal(props) {
  let isModalOpen = useSelector(selectTutorialModal);
  let dispatch = useDispatch();

  let handleClose = () => {
    dispatch(closeTutorialModal());

    localStorage.setItem(LANDING_PAGE_CLOSE, "true");
  };

  let [step, setStep] = useState(0);

  let nextStep = () => {
    localStorage.setItem(LANDING_PAGE_CLOSE, "true");
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
                  {step === 2 && <TickWhite />}
                </div>

                <ProgressStrip selected={step} onChange={(e) => setStep(e)} />
              </div>
            </div>

            <div className={styles["right"]}>
              <video
                src={STEP_DETAILS[step].video}
                className={styles["img"]}
                loop
                autoPlay
                muted
              ></video>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
