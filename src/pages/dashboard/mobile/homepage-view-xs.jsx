import AuthService from "../../../common/API/network/AuthService";
import { DesktopPromotion } from "../../../common/components/desktop-promotion/DesktopPromotion";
import Navbar from "../../../common/components/navbar/Navbar";
import Timer from "../../../common/components/timer/timer";
import { LandingPageMobile } from "../../landing-page/mobile/LandingPageMobile";
import OnBoarding from "../../onboarding/Onboarding";
import useHomepage from "../HomePage-hook";
import styles from "./homepage-mobile.module.scss";

export function HomepageMobile() {
  let { timerBgColor } = useHomepage();
  return (
    <div className={styles["container"]}>
      <Navbar />

      <DesktopPromotion />
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
    </div>
  );
}
