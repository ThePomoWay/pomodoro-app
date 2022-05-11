import { stat } from "fs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectFirstUserStep } from "../../state/selectors";
import { setFirstUserStep } from "../../state/slice/GlobalSlice";
import { CursorVector } from "../../svgs/CursorVector";
import { TimerUI } from "../timer-ui/TimerUI";
import { CarouselIndicator } from "./CarouselIndicator";

import styles from "./FirstUserOnboarding.module.scss";

export function FirstUserOnboarding(props) {
  let firstUserStep = useSelector(selectFirstUserStep);

  let dispatch = useDispatch();
  let [state, setState] = useState();

  let goToStep = function (step) {
    setState("shift");

    setTimeout(() => {
      dispatch(setFirstUserStep(2));
    }, 500);
  };

  return (
    <div className={styles["onboarding-container"]}>
      {firstUserStep === 1 && (
        <div
          className={
            styles["screen-1-text"] +
            " " +
            (state === "shift" && styles["slide-out"])
          }
        >
          <h1 className={styles["title"]}>Introducing TimeDojo</h1>
          <h2 className={styles["sub-title"]}>The ultimate Pomodoro Timer</h2>
          <h3 className={styles["sub-desc"]}>
            Focussed sessions to conquer your daily to-do's one task at a time.
          </h3>
          <button className="btn btn-save" onClick={(e) => goToStep(2)}>
            Let's get started
          </button>
        </div>
      )}

      {state === "shift" && (
        <div
          className={
            styles["screen-1-text"] +
            " " +
            (state === "shift" && styles["slide-in"])
          }
        >
          <h1 className={styles["screen-title"]}>Plan Your Day</h1>
          <CarouselIndicator step={1} />
          <div className={styles["features"]}>
            <div className={styles["feature-1"] + " " + styles["feature"]}>
              <div className={styles["circle"] + " " + styles["green"]}>1</div>
              <div className={styles["second-row"]}>
                <p className={styles["head"]}>
                  <span className="font-theme">Add Tasks</span> to work on today
                </p>
                <div className={styles["empty-task"]}>
                  <div className={styles["task-circle"]}></div>
                  <div className={styles["text"]}>
                    Review Essay for History class
                  </div>
                </div>
                <div className={styles["cta"]}>
                  <button className="btn add-task-btn">+ Create Task</button>
                  <CursorVector />
                </div>
              </div>
            </div>
            <div className={styles["feature-2"] + " " + styles["feature"]}>
              <div className={styles["circle"] + " " + styles["red"]}>2</div>
              <div className={styles["second-row"]}>
                <p className={styles["head"]}>
                  <span className="font-theme">Estimate</span> the pomodoros you
                  need to finish the tasks
                </p>
                <div className={styles["empty-edit-task"]}>
                  <div className={styles["text"]}>
                    Review essay for History class
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles["timer"] + " " + styles[state]}>
        <TimerUI />
      </div>
    </div>
  );
}
