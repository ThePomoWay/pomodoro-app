import { stat } from "fs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectFirstUserStep } from "../../state/selectors";
import { setFirstUserStep } from "../../state/slice/GlobalSlice";
import { AddIcon } from "../../svgs/AddIcon";
import { CursorVector } from "../../svgs/CursorVector";
import { OnboardingPlay } from "../../svgs/OnboardingPlay";
import { ProjectSidenavIcon } from "../../svgs/ProjectSidenavIcon";
import { TimerUI } from "../timer-ui/TimerUI";
import { CarouselIndicator } from "./CarouselIndicator";

import styles from "./FirstUserOnboarding.module.scss";

export function FirstUserOnboarding(props) {
  let firstUserStep = useSelector(selectFirstUserStep);

  let dispatch = useDispatch();
  let [state, setState] = useState(1);

  let goToStep = function (step) {
    setState(step);

    setTimeout(() => {
      dispatch(setFirstUserStep(step));
    }, 500);
  };

  return (
    <div className={styles["onboarding-container"]}>
      {firstUserStep === 1 && (
        <div
          className={
            styles["screen-1-text"] + " " + (state === 2 && styles["slide-out"])
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

      {firstUserStep > 1 && (
        <div
          className={
            styles["screen-1-text"] +
            " " +
            (state === "shift" && styles["slide-in"])
          }
        >
          <h1 className={styles["screen-title"]}>Plan Your Day</h1>
          <CarouselIndicator step={firstUserStep - 1} />
          <div className={styles["features"]}>
            {firstUserStep === 2 && (
              <div
                className={`${styles["features-grid"]} ${
                  state === 3 && styles["slide-out"]
                }`}
              >
                <div className={styles["feature-1"] + " " + styles["feature"]}>
                  <div className={styles["circle"] + " " + styles["green"]}>
                    1
                  </div>
                  <div className={styles["second-row"]}>
                    <p className={styles["head"]}>
                      <span className="font-theme">Add Tasks</span> to work on
                      today
                    </p>

                    <div className={styles["cta"]}>
                      <button className="btn add-task-btn">
                        + Create Task
                      </button>
                      <CursorVector />
                    </div>
                  </div>
                </div>
                <div className={styles["feature-2"] + " " + styles["feature"]}>
                  <div className={styles["circle"] + " " + styles["red"]}>
                    2
                  </div>
                  <div className={styles["second-row"]}>
                    <p className={styles["head"]}>
                      <span className="font-theme">Estimate</span> the pomodoros
                      you need to finish the tasks
                    </p>
                    <div className={styles["empty-edit-task"]}>
                      <div className={styles["text"]}>
                        Review essay for History class
                      </div>
                      <div className={styles["estimated-pomos"]}>
                        <p>Estimate:</p>
                        <div className={styles["estimated"]}>
                          <span className={styles["circle"]}>1</span>
                          <span className={styles["circle"]}>2</span>
                          <span className={styles["circle"]}>3</span>
                          <span className={styles["circle-hollow"]}>4</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles["feature-3"] + " " + styles["feature"]}>
                  <div className={styles["circle"] + " " + styles["orange"]}>
                    1
                  </div>
                  <div className={styles["second-row"]}>
                    <p className={styles["head"]}>
                      Press <span className="font-theme">Play</span> to start
                      your focused session
                    </p>
                    <div className={styles["empty-play-task"]}>
                      <div className={styles["task-circle"]}></div>
                      <div className={styles["text"]}>
                        Review Essay for History class
                      </div>
                      <OnboardingPlay />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {firstUserStep === 3 && (
              <div
                className={`${styles["features-grid"]} ${
                  state === 4 && styles["slide-out"]
                }`}
              >
                <div className={styles["feature-1"] + " " + styles["feature"]}>
                  <div className={styles["circle"] + " " + styles["green"]}>
                    1
                  </div>
                  <div className={styles["second-row"]}>
                    <p className={styles["head"]}>
                      Switch on &nbsp;
                      <span className="font-theme">Focus Mode</span> &nbsp; to
                      block distracting websites
                    </p>
                    <div className={styles["empty-toggle"]}>
                      <div className={styles["round"]}></div>
                      <CursorVector />
                    </div>
                  </div>
                </div>
                <div className={styles["feature-2"] + " " + styles["feature"]}>
                  <div className={styles["circle"] + " " + styles["red"]}>
                    2
                  </div>
                  <div className={styles["second-row"]}>
                    <p className={styles["head"]}>
                      Manage sites to block using
                      <span className="font-theme">Manage Focus View</span>
                    </p>
                    <div className={styles["empty-focus-block"]}>
                      <div className={styles["row-1"]}>
                        <div className={styles["focus"]}>
                          <div className={styles["block-input"]}>
                            Type URL here...
                          </div>
                        </div>

                        <button className="btn add-task-btn">+ ADD SITE</button>
                      </div>
                      <div className={styles["blocked-sites"]}>
                        <div className={styles["blocked-site"]}>
                          <div className={styles["left"]}>
                            <img
                              src={
                                "http://www.google.com/s2/favicons?domain=" +
                                "facebook.com"
                              }
                            />
                            facebook.com
                          </div>
                          <button className={styles["button"]}>Block</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {firstUserStep === 4 && (
              <div
                className={`${styles["features-grid"]} ${
                  state === 5 && styles["slide-out"]
                }`}
              >
                <div className={styles["feature-1"] + " " + styles["feature"]}>
                  <div className={styles["circle"] + " " + styles["green"]}>
                    1
                  </div>
                  <div className={styles["second-row"]}>
                    <p className={styles["head"]}>
                      Organize your tasks using &nbsp;
                      <span className="font-theme">lists</span>,
                      <span className="font-theme">labels</span> and &nbsp;
                      <span className="font-theme">priorities</span>
                    </p>
                    <div className={styles["empty-project"]}>
                      <div className={styles["items"]}>
                        <div
                          className={styles["item"] + " " + styles["selected"]}
                        >
                          <div className={styles["left"]}>
                            <ProjectSidenavIcon />
                            <span>List</span>
                          </div>
                          <div className={styles["right"]}>
                            <AddIcon />
                          </div>
                        </div>
                        <div className={styles["item"]}></div>
                        <div className={styles["item"]}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles["feature-2"] + " " + styles["feature"]}>
                  <div className={styles["circle"] + " " + styles["red"]}>
                    2
                  </div>
                  <div className={styles["second-row"]}>
                    <p className={styles["head"]}>
                      Add task from project to daily todo by clicking on{" "}
                      <span className="font-theme">'+'</span>
                      button
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={styles["cta"]}>
            <button className="btn btn-cancel">Skip</button>
            <button
              className="btn add-task-btn"
              onClick={(e) => goToStep(firstUserStep + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <div
        className={
          styles["timer"] + " " + (state !== 1 ? styles["shift"] : undefined)
        }
      >
        <TimerUI />
      </div>
    </div>
  );
}
