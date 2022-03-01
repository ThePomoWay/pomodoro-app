import Navbar from "../../../common/components/navbar/Navbar";
import { TodaysTaskContainer } from "../../../common/components/tasklist/TodaysTaskContainer";
import Timer from "../../../common/components/timer/timer";
import OnBoarding from "../../onboarding/Onboarding";
import useHomepage from "../HomePage-hook";
import styles from "./homepage-mobile.module.scss";

export function HomepageMobile() {
  let { timerBgColor } = useHomepage();
  return (
    <div className={styles["container"]}>
      <Navbar />
      <div className={styles["main-content"] + " " + styles[timerBgColor]}>
        <div className={styles["timer"]}>
          <Timer hideBlur={true} />
        </div>
        <TodaysTaskContainer />
      </div>

      <OnBoarding />
    </div>
  );
}
