import { useEffect, useRef, useState } from "react";
import AuthService from "../../../common/API/network/AuthService";
import { DesktopPromotion } from "../../../common/components/desktop-promotion/DesktopPromotion";
import Navbar from "../../../common/components/navbar/Navbar";
import Timer from "../../../common/components/timer/timer";
import { LandingPageMobile } from "../../landing-page/mobile/LandingPageMobile";
import OnBoarding from "../../onboarding/Onboarding";
import useHomepage from "../HomePage-hook";
import styles from "./homepage-mobile.module.scss";
import { BreathingExercise } from "../../../common/components/breathing-exercise/BreathingExercise";
import {
  POMO_BREAK_RUNNING_STATE,
  POMO_LONG_BREAK_RUNNING_STATE,
} from "../../../common/utils/constants";

export function HomepageMobile() {
  let { timerBgColor, pomoState } = useHomepage();

  const [showBreathing, setShowBreathing] = useState(false);
  const prevPomoStateRef = useRef(pomoState);

  useEffect(() => {
    const prev = prevPomoStateRef.current;
    const isBreakNow =
      pomoState === POMO_BREAK_RUNNING_STATE ||
      pomoState === POMO_LONG_BREAK_RUNNING_STATE;
    const wasBreakBefore =
      prev === POMO_BREAK_RUNNING_STATE ||
      prev === POMO_LONG_BREAK_RUNNING_STATE;

    if (isBreakNow && !wasBreakBefore) {
      setShowBreathing(true);
    }
    prevPomoStateRef.current = pomoState;
  }, [pomoState]);
  return (
    <div className={styles["container"]}>
      {showBreathing && (
        <BreathingExercise onDismiss={() => setShowBreathing(false)} />
      )}
      <Navbar />

      <div className={styles["main-content"] + " " + styles[timerBgColor]}>
        <div className={styles["timer"]}>
          <Timer hideBlur={true} />
        </div>
        {/* <TodaysTaskContainer /> */}
      </div>
      {!AuthService.isLoggedIn() && (
        <>
          <LandingPageMobile />

          <OnBoarding />
        </>
      )}
      <DesktopPromotion />
    </div>
  );
}
