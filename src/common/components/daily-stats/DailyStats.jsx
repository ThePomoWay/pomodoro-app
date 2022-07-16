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
      ePomos += task.epomo - Math.floor(task.cpomo);
    }
  }

  return (
    <div className={styles["completed-pomos"]}>
      {(ePomos === 0 && cPomos === 0 && (
        <span style={{ marginLeft: "6px" }}>
          List down tasks you want to work on day.
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
            {ePomos > 0 &&
              [...Array(ePomos)].map((item, index) => (
                <div
                  key={`pending-pomo-${index}`}
                  className={styles["estimated-pomo"]}
                >
                  {index + cPomos + 1}
                </div>
              ))}
          </div>

          {cPomos > 0 && (
            <div className={styles["apprx-time"]}>
              {getTimeText((cPomos * defaults.defaultWorkTime) / 60)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
