import NavbarNew from "../../common/components/navbar-new/NavbarNew";
import { FeatureCard } from "./FeatureCard";
import styles from "./LandingPage.module.scss";

import { useHistory } from "react-router-dom";
import { ReactComponent as Ribbon1 } from "../../common/svgs/ribbon-1.svg";
import { ReactComponent as Ribbon2 } from "../../common/svgs/ribbon-2.svg";
import { ReactComponent as Ribbon3 } from "../../common/svgs/ribbon-3.svg";
import { ReactComponent as Ribbon4 } from "../../common/svgs/ribbon-4.svg";

import { ReactComponent as Ribbon5 } from "../../common/svgs/ribbon-5.svg";

import { ReactComponent as ProblemSvg } from "../../common/svgs/pricing-problem-bg.svg";
import { ReactComponent as BlogginSvg } from "../../common/svgs/blogging-bg.svg";
import { DotGrid } from "./DotGrid";
import { useState } from "react";

import { faqs } from "./faq";
import { useDispatch } from "react-redux";
import { openTutorialModal } from "../../common/state/slice/GlobalSlice";
import { ReactComponent as PlaySvg } from "../../common/svgs/PlayLanding.svg";
import { LANDING_PAGE_CLOSE } from "../../common/utils/constants";

export function LandingPage(props) {
  let [faqSection, setFaqSection] = useState(0);
  let history = useHistory();
  let dispatch = useDispatch();
  let getStarted = () => {
    dispatch(openTutorialModal());
    localStorage.setItem(LANDING_PAGE_CLOSE, "true");
    history.push("/app");
  };
  return (
    <div>
      <NavbarNew />
      <div className={styles["first-container"]}>
        <div className={styles["left"] + " " + styles["align-center"]}>
          <p className={styles["title"]}>
            <p>Productive & distraction free work sessions</p>
          </p>

          <p className={styles["sub-title"]}>
            The Ultimate Pomdoro Timer ⏰ for all your tough to-dos and powerful website blocker 
            so that you don’t start scrolling youtube or wandering on facebook in your work sessions 🤓
          </p>
          <p className={styles["sub-title"]}>
          That’s not it, meet you daily focus goal and start earning your badges now 🚀 
          </p>
          <div className={styles["ctas"]}>
            <button className="btn btn-add-new" onClick={() => getStarted()}>
              Get Started
            </button>
            {/* <p className={styles["add-more"]}>Know More</p> */}
          </div>
        </div>
        <div className={styles["right"]}>
          <div className={styles["main-circle"]}>
            <div className={styles["circle-2"]}>
              <div className={styles["text"]}>25:00</div>
              <div className={styles["play"]}>
                <PlaySvg />
              </div>
            </div>
            <div className={styles["purple-rect"]}></div>
            <span className={styles["tp-circle-1"]}>
              <span className={styles["rect"]}></span>
            </span>
            <span className={styles["rect-3"]}></span>

            <span className={styles["tp-circle-2"]}>
              <span className={styles["rect"]}></span>
            </span>

            <span className={styles["tp-circle-3"]}></span>
          </div>
        </div>
      </div>
      <div className={styles["container"]}>
        <div className={styles["left"]}>
          <span className={styles["rect-4"]}></span>
          <h2 className={styles["title"]}>Why use Timedojo?</h2>
          <h3 className={styles["sub-title"]}>
          Are you watching tons of videos on how to overcome procrastination? Timedojo gives you the right push to get started on your daily tasks list. 
          We use the proven Pomodoro  technique to improve focus at work & time management.
          </h3>
          <h3 className={styles["sub-title"]}>
          Here is why we are the best Pomodoro app<span className={styles['emoji']}>   👉</span>
          </h3>
          <h3 className={styles["sub-title-i"]}>
            Healthier work habits are just a Pomodoro away!
          </h3>
        </div>
        <div className={styles["right"]}>
          <FeatureCard
            text={"Undivided Pomo-Focus"}
            desc={"10x better time management by blocking distracting sites "}
          />
          <FeatureCard
            text={"Art of Prioritisation"}
            desc={"Organise tasks with lists, labels and filters"}
          />
          <FeatureCard
            text={"Streamline Productivity"}
            desc={"Track focus intensity & consistency"}
          />
          <FeatureCard
            text={"Empowered to Customise"}
            desc={"Freedom to decide Pomo goals with customisable clock"}
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
        <div className={styles["center"]}>
          <div className={styles["alt-title"]}>
            Do you relate with <br />
            these problems?
          </div>

          <div className={styles["problem-cards"]}>
            <div className={styles["problem-card"]}>
              Not motivated enough to tick off your to-dos despite looming
              deadlines
            </div>
            <div className={styles["problem-card"]}>
              Little distractions that break your focus while working
            </div>
            <div className={styles["problem-card"]}>
              Work-life balance seems to be a far away dream
            </div>
          </div>

          <div className={styles["problem-svg"]}>
            <ProblemSvg />
          </div>
          {/* <div className={styles["ribbons"]}>
            <Ribbon1 className={styles["ribbon-1"]} />
            <Ribbon2 className={styles["ribbon-2"]} />
            <Ribbon3 className={styles["ribbon-3"]} />
            <Ribbon4 className={styles["ribbon-4"]} />
          </div> */}
        </div>
        {/* <div className={styles["right"]}>
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
        </div> */}
      </div>

      {/* <div className={styles["container"]}>
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
      </div> */}

      <div className={styles["container"]}>
        <div className={styles["left"]}>
          <div className={styles["title"]}>
            Pomodoro <br />
            Technique
          </div>
          <div className={styles["desc"]}>Productive. Prolific. Proficient</div>
          <div className={styles["sub-title"]}>
            We operate using the Pomodoro technique timer, an ancient
            methodology developed by Francesco Cirillo in the late 1980s.
            Pomodoro technique has a 25-5 rule wherein you focus for 25 minutes,
            followed by a 5-minute break.
          </div>
          <h3 className={styles["sub-title-i"]}>
          Now, time is on your side!
          </h3>
        </div>
        <div className={styles["right"]}>
          <BlogginSvg className={styles["max-svg"]} />
        </div>
      </div>

      <div className={styles["container"]}>
        <div className={styles["left"]}>
          <div className={styles["small-title"]}>
            How to Manage <br />
            time better with <br />
            Timedojo?
          </div>
          <div className={styles["sub-title"]}>
            Procrastination persists to be a challenge for most people,
            especially in a remote work setup. Timedojo is here to redefine your
            productivity game!
          </div>
          <div className={styles["five-steps"]}>
            <Ribbon5 className={styles["ribbon"]} />
            <div className={styles["num"]}>
              5<div className={styles["num-2"]}>5</div>
            </div>
            <div className={styles["text"]}>
              Simple Steps to a Pomodoro Lifestyle!
            </div>
          </div>
        </div>
        <div className={styles["right"]}>
          <div className={styles["five-steps-box"]}>
            <div className={styles["step"]}>
              <div className={styles["circle"]}>1</div>
              <p className={styles["text"]}>
                Break your work into multiple micro-tasks
              </p>
            </div>
            <div className={styles["step"]}>
              <div className={styles["circle"]}>2</div>
              <p className={styles["text"]}>
                Estimate number of 25- minute intervals (Pomodoros) for each
                task
              </p>
            </div>
            <div className={styles["step"]}>
              <div className={styles["circle"]}>3</div>
              <p className={styles["text"]}>
                Small tasks can be coupled in one Pomodoro
              </p>
            </div>
            <div className={styles["step"]}>
              <div className={styles["circle"]}>4</div>
              <p className={styles["text"]}>
                After every Pomodoro, reward yourself with a 5-minute break
              </p>
            </div>
            <div className={styles["step"]}>
              <div className={styles["circle"]}>5</div>
              <p className={styles["text"]}>
                Treat yourself to an extended break after completing a cycle of
                4 Pomodoros.
              </p>
            </div>

            <div className={styles["oval"]}></div>
            <div className={styles["dot-grid-2"]}>
              <DotGrid rows={5} columns={10} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles["container"]}>
        <div className={styles["center"]}>
          <div className={styles["small-title"]}>
            Come Join our Tribe of Achievers!
          </div>

          <div className={styles["testimonial-box"]}>
            <div className={styles["testimonial"]}>
              <div className={styles["header"]}>
                <div className={styles["img"]}>
                  <img src="/dp-1.png" />
                </div>
                <div className={styles["designation"]}>
                  <div className={styles["name"]}>Ron Howard</div>
                  <div className={styles["role"]}>Freelance Writer</div>
                </div>
              </div>
              <div className={styles["content"]}>
                I usually do up to 10 Pomos a day! Estimating tasks in Pomodoros
                has helped me to not exaggerate my to-do's, saving me from
                disappointment at the end of the day.
              </div>
            </div>

            <div className={styles["testimonial"]}>
              <div className={styles["header"]}>
                <div className={styles["img"]}>
                  <img src="/dp-2.png" />
                </div>
                <div className={styles["designation"]}>
                  <div className={styles["name"]}>Matt</div>
                  <div className={styles["role"]}>Freelance Writer</div>
                </div>
              </div>
              <div className={styles["content"]}>
                I love how I get focus timer analytics on the platform. Now, I
                know what time of the day I am the most productive, and I can
                plan my day accordingly.
              </div>
            </div>
            <div className={styles["testimonial"]}>
              <div className={styles["header"]}>
                <div className={styles["img"]}>
                  <img src="/dp-3.png" />
                </div>
                <div className={styles["designation"]}>
                  <div className={styles["name"]}>Sue</div>
                  <div className={styles["role"]}>CEO</div>
                </div>
              </div>
              <div className={styles["content"]}>
                Timedojo helps me organise my admin tasks into labels and
                filters. This is super helpful in giving me visibility for the
                rest of the day!
              </div>
            </div>
            <div className={styles["testimonial"]}>
              <div className={styles["header"]}>
                <div className={styles["img"]}>
                  <img src="/dp-4.png" />
                </div>
                <div className={styles["designation"]}>
                  <div className={styles["name"]}>Jim</div>
                  <div className={styles["role"]}>Brand Manager</div>
                </div>
              </div>
              <div className={styles["content"]}>
                Sites that distract me from my deadline can now be blocked
                during my focus sessions. This platform is truly the best online
                pomodoro timer!
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles["container"]}>
        <div className={styles["center"]}>
          <div className={styles["title"]}>Frequently Asked Questions</div>
          <div className={styles["faq-box"]}>
            <div className={styles["header"]}>
              <button
                className={`btn ${
                  faqSection === 0 ? "round-btn" : "round-btn-empty"
                }`}
                onClick={(e) => setFaqSection(0)}
              >
                Pomodoro Technique
              </button>
              <button
                className={`btn ${
                  faqSection === 1 ? "round-btn" : "round-btn-empty"
                }`}
                onClick={(e) => setFaqSection(1)}
              >
                Timedojo
              </button>
            </div>
            <div className={styles["faqs"]}>
              {faqs[faqSection].map((item) => (
                <div className={styles["faq"]}>
                  <div className={styles["question"]}>{item.question}</div>
                  <div className={styles["answer"]}>{item.answer}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
