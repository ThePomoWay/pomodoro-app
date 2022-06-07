import NavbarNew from "../../common/components/navbar-new/NavbarNew";
import { FeatureCard } from "./FeatureCard";
import styles from "./LandingPage.module.scss";
import { ReactComponent as Ribbon1 } from "../../common/svgs/ribbon-1.svg";
import { ReactComponent as Ribbon2 } from "../../common/svgs/ribbon-2.svg";
import { ReactComponent as Ribbon3 } from "../../common/svgs/ribbon-3.svg";
import { ReactComponent as Ribbon4 } from "../../common/svgs/ribbon-4.svg";
import { DotGrid } from "./DotGrid";

export function LandingPage(props) {
  return (
    <div>
      <NavbarNew />
      <div className={styles["first-container"]}>
        <div className={styles["left"] + " " + styles["align-center"]}>
          <p className={styles["title"]}>
            <p>Productive &</p>
            <p>Distraction Free </p>
            <p>Work Sessions</p>
          </p>

          <p className={styles["sub-title"]}>
            Are your deadlines overwhelming you? Timedojo gives you the right
            push to get started on your daily tasks list for the day. We use the
            proven Pomodoro technique to improve work quality & time management.
          </p>

          <div className={styles["ctas"]}>
            <button className="btn btn-add-new">Get Started</button>
            <p className={styles["add-more"]}>Know More</p>
          </div>
        </div>
        <div className={styles["right"]}>
          <div className={styles["main-circle"]}>
            <div className={styles["circle-2"]}></div>
            <div className={styles["purple-rect"]}></div>
            <span className={styles["tp-circle-1"]}>
              <span className={styles["rect"]}></span>
            </span>

            <span className={styles["tp-circle-2"]}>
              <span className={styles["rect"]}></span>
            </span>

            <span className={styles["tp-circle-3"]}></span>
          </div>
        </div>
      </div>
      <div className={styles["container"]}>
        <div className={styles["left"]}>
          <h2 className={styles["title"]}>
            Timedojo is not <br /> just the Timer!
          </h2>
          <h3 className={styles["sub-title"]}>
            There are a thousand reasons to procrastinate, but just one is
            enough to fight it! Introducing Timedojo: Now, no more broken
            promises of staying productive! Here is why we are the best at what
            we do:
          </h3>
          <h3 className={styles["sub-title-i"]}>
            Healthier work habits are just a Pomodoro away!
          </h3>
        </div>
        <div className={styles["right"]}>
          <FeatureCard
            text={"Undivided Pomo Focus"}
            desc={"10x better time management by blocking distracting sites"}
          />
          <FeatureCard
            text={"Undivided Pomo Focus"}
            desc={"10x better time management by blocking distracting sites"}
          />
          <FeatureCard
            text={"Undivided Pomo Focus"}
            desc={"10x better time management by blocking distracting sites"}
          />
          <FeatureCard
            text={"Undivided Pomo Focus"}
            desc={"10x better time management by blocking distracting sites"}
          />
        </div>
      </div>
      <div className={styles["container"]}>
        <div className={styles["center"]}>
          <div className={styles["title"]}>
            Create Tasks, Track Time & Improve
          </div>
          <div className={styles["sub-title"]}>
            Are your deadlines overwhelming you? Timedojo gives you the right
            push to get started on your daily tasks list for the day. We use the
            proven Pomodoro technique to improve work quality & time management.
          </div>

          <img src="/landing-img.png" className={styles["img"]} />
        </div>
      </div>

      <div className={styles["container"]}>
        <div className={styles["left"]}>
          <div className={styles["title"]}>
            How to manage <br />
            time better with <br />
            Pomodoro?
          </div>
          <div className={styles["sub-title"]}>
            Do you relate to following problems <br />
            during work?
          </div>
          <div className={styles["ribbons"]}>
            <Ribbon1 className={styles["ribbon-1"]} />
            <Ribbon2 className={styles["ribbon-2"]} />
            <Ribbon3 className={styles["ribbon-3"]} />
            <Ribbon4 className={styles["ribbon-4"]} />
          </div>
        </div>
        <div className={styles["right"]}>
          <div className={styles["boxes"]}>
            <div className={styles["box"]}>
              Not motivated enough to tick off your to-dos despite looming
              deadlines
            </div>
            <div className={styles["box"]}>
              Not motivated enough to tick off your to-dos despite looming
              deadlines
            </div>
            <div className={styles["box"]}>
              Not motivated enough to tick off your to-dos despite looming
              deadlines
            </div>
            <div className={styles["box"]}>
              Not motivated enough to tick off your to-dos despite looming
              deadlines
            </div>
          </div>
        </div>
      </div>

      <div className={styles["container"]}>
        <div className={styles["dot-grid"]}>
          <DotGrid rows={5} columns={8} />
        </div>
        <div className={styles["left"]}>
          <div className={styles["title"]}>
            Three Simple Steps to a Pomodoro Lifestyle!
          </div>
          <div className={styles["sub-title"]}>
            There are a thousand reasons to procrastinate, but just one is
            enough to fight it! Introducing Timedojo: Now, no more broken
            promises of staying productive! Here is why we are the best at what
            we do:
          </div>
        </div>

        <div className={styles["right"]}>
          <div className={styles["feature-2"]}>
            <div className={styles["circles"]}></div>
            <div className={styles["feature-desc"]}>
              <div className={styles["feature-title"]}>Break Your Task</div>
              <div className={styles["feature-description"]}>
                You have to break your work into micro-tasks and assign them
                within 25- minute time intervals (one Pomodoro).
              </div>
            </div>
          </div>
          <div className={styles["feature-2"]}>
            <div className={styles["circles"]}></div>
            <div className={styles["feature-desc"]}>
              <div className={styles["feature-title"]}>Break Your Task</div>
              <div className={styles["feature-description"]}>
                You have to break your work into micro-tasks and assign them
                within 25- minute time intervals (one Pomodoro).
              </div>
            </div>
          </div>
          <div className={styles["feature-2"]}>
            <div className={styles["circles"]}></div>
            <div className={styles["feature-desc"]}>
              <div className={styles["feature-title"]}>Break Your Task</div>
              <div className={styles["feature-description"]}>
                You have to break your work into micro-tasks and assign them
                within 25- minute time intervals (one Pomodoro).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
