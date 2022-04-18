import { useSelector } from "react-redux";
import {
  selectCompletedPomos,
  selectDefaultTimes,
  selectTodaysTasks,
} from "../../state/selectors";
import { getTimeText } from "../../utils/date-utils";

import styles from "./DailyStats.module.scss";

export function DailyStats(props) {
  let todaysTasks = useSelector(selectTodaysTasks);
  let cPomos = useSelector(selectCompletedPomos);
  let defaults = useSelector(selectDefaultTimes);

  cPomos = 1;

  let ePomos = 0;
  for (let task of todaysTasks) {
    if (task.cpomo < task.epomo) {
      ePomos += task.epomo - task.cpomo;
    }
  }

  return (
    <div className={styles["completed-pomos"]}>
      {(ePomos === 0 && cPomos === 0 && (
        <span style={{ marginLeft: "6px" }}>
          You haven't added estimates yet.
        </span>
      )) || (
        <div className="flex" style={{ width: "100%" }}>
          <span className={styles["title"]}>Pomodoros </span>
          <div className={styles["circles"]}>
            {[...Array(cPomos)].map((item, index) => (
              <div
                key={`completed-pomo-${index}`}
                className={styles["completed-pomo"] + " " + styles["filled"]}
              >
                {index + 1}
              </div>
            ))}
            {ePomos > cPomos &&
              [...Array(ePomos - cPomos)].map((item, index) => (
                <div
                  key={`pending-pomo-${index}`}
                  className={styles["estimated-pomo"]}
                >
                  {index + cPomos + 1}
                </div>
              ))}
          </div>

          {ePomos > cPomos && (
            <div className={styles["apprx-time"]}>
              ~
              {getTimeText(((ePomos - cPomos) * defaults.defaultWorkTime) / 60)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
