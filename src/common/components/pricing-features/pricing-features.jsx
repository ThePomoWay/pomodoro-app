import styles from "../pricing-modal/PricingModal.module.scss";
import { DarkModeIcon } from "../../svgs/DarkModeIcon";
import { PricingModalAnalysisIcon } from "../../svgs/PricingModalAnalysisIcon";
import { PricingModalBlockIcon } from "../../svgs/PricingModalBlockIcon";
import { PricingModalMusicIcon } from "../../svgs/PricingModalMusicIcon";
import { PricingModalUnlockIcon } from "../../svgs/PricingModalUnlockIcon";
import { PricingNotesIcon } from "../../svgs/PricingNotesIcon";

export default function PricingFeatures() {
    return (
        <span>
            <div className={styles["heading"]}>
            Bring more focus to your life with{" "}
            <span className={styles["theme"]}>Premium</span>
            </div>
            <div className={styles["features"]}>
            <div className={styles["feature"]}>
                <div className={styles["svg"]}>
                <PricingNotesIcon />
                </div>
                <div className={styles["text"]}>Create any number of projects</div>
            </div>
            <div className={styles["feature"]}>
                <div className={styles["svg"]}>
                <DarkModeIcon />
                </div>
                <div className={styles["text"]}>Access to sleek dark mode</div>
            </div>
            <div className={styles["feature"]}>
                <div className={styles["svg"]}>
                <PricingModalAnalysisIcon />
                </div>
                <div className={styles["text"]}>
                Access to weekly and monthly insights
                </div>
            </div>
            <div className={styles["feature"]}>
                <div className={styles["svg"]}>
                <PricingModalMusicIcon />
                </div>
                <div className={styles["text"]}>
                Access to multiple sound settings
                </div>
            </div>
            <div className={styles["feature"]}>
                <div className={styles["svg"]}>
                <PricingModalBlockIcon />
                </div>
                <div className={styles["text"]}>
                Block any number of websites in focus mode
                </div>
            </div>
            <div className={styles["feature"]}>
                <div className={styles["svg"]}>
                <PricingModalUnlockIcon />
                </div>
                <div className={styles["text"]}>
                Unlock new features that we release.
                </div>
            </div>
            </div>
        </span>
    )
}