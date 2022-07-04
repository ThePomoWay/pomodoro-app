import styles from "./LandingPageMobile.module.scss";
import { ReactComponent as BlogginSvg } from "../../../common/svgs/blogging-bg.svg";
import { ReactComponent as ProblemSvg } from "../../../common/svgs/pricing-problem-bg.svg";
import { DotGrid } from "../DotGrid";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { faqs } from "../faq";
import { useState } from "react";

export function LandingPageMobile(props) {
  let [faqSection, setFaqSection] = useState(0);
  return (
    <div>
      <div className={styles["container"] + " " + styles["do-you"]}>
        <div className={styles["alt-title"]}>
          Do you relate with <br />
          these problems?
        </div>

        <div className={styles["problem-card"]}>
          Not motivated enough to tick off your to-dos despite looming deadlines
        </div>
        <div className={styles["problem-card"]}>
          Little distractions that break your focus while working
        </div>
        <div className={styles["problem-card"]}>
          Work-life balance seems to be a far away dream
        </div>
      </div>
      <div className={styles["container"]}>
        <div className={styles["title"]}>
          Pomodoro <br />
          Technique
        </div>
        <div className={styles["desc"]}>Productive. Prolific. Proficient</div>
        <div className={styles["sub-title"]}>
          We operate using the Pomodoro technique timer, an ancient methodology
          developed by Francesco Cirillo in the late 1980s. Pomodoro technique
          has a 25-5 rule wherein you focus for 25 minutes, followed by a
          5-minute break.
        </div>
        <h3 className={styles["sub-title-i"]}>Now, time is on your side!</h3>

        <BlogginSvg className={styles["max-svg"]} />
      </div>
      <div className={styles["container"]}>
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
              Estimate number of 25- minute intervals (Pomodoros) for each task
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
              Treat yourself to an extended break after completing a cycle of 4
              Pomodoros.
            </p>
          </div>

          {/* <div className={styles["dot-grid-2"]}>
            <DotGrid rows={5} columns={10} />
          </div> */}
        </div>
      </div>

      <div className={styles["container"]}>
        <div className={styles["desc"]}>Come Join our Tribe of Achievers!</div>

        <Carousel>
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
                <div className={styles["name"]}>Vaibhav Goyal</div>
                <div className={styles["role"]}>Golang Developer</div>
              </div>
            </div>
            <div className={styles["content"]}>
              I love how I get focus timer analytics on the platform. Now, I
              know what time of the day I am the most productive, and I can plan
              my day accordingly.
            </div>
          </div>
          <div className={styles["testimonial"]}>
            <div className={styles["header"]}>
              <div className={styles["img"]}>
                <img src="/dp-3.png" />
              </div>
              <div className={styles["designation"]}>
                <div className={styles["name"]}>Parv Tiwari</div>
                <div className={styles["role"]}>Content Writer</div>
              </div>
            </div>
            <div className={styles["content"]}>
              Timedojo helps me organise my admin tasks into labels and filters.
              This is super helpful in giving me visibility for the rest of the
              day!
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
              Sites that distract me from my deadline can now be blocked during
              my focus sessions. This platform is truly the best online pomodoro
              timer!
            </div>
          </div>
        </Carousel>
      </div>

      <div className={styles["container"]}>
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
  );
}
