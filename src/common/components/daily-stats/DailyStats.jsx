import { useSelector } from "react-redux";
import { selectCompletedPomos, selectTodaysTasks } from "../../state/selectors";

import styles from "./DailyStats.module.scss";

export function DailyStats(props) {
  let todaysTasks = useSelector(selectTodaysTasks);
  let cPomos = useSelector(selectCompletedPomos);

  let ePomos = 0;
  for (let task of todaysTasks) {
    ePomos += task.epomo;
  }

  return (
    <div className={styles["completed-pomos"]}>
      {(ePomos === 0 && cPomos === 0 && (
        <span style={{ marginLeft: "6px" }}>
          You haven't added estimates yet.
        </span>
      )) || (
        <div className="flex">
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
        </div>
      )}
    </div>
  );
}
