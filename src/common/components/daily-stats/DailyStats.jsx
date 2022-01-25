import { useSelector } from "react-redux";
import { selectCompletedPomos, selectTodaysTasks } from "../../state/selectors";

import styles from "./DailyStats.module.scss";

export function DailyStats(props) {

    let todaysTasks = useSelector(selectTodaysTasks);
    let cPomos = useSelector(selectCompletedPomos);

    let ePomos = 0;
    for(let task of todaysTasks) {
        ePomos += task.estimatedPomos
    }

    return (
        <div className={styles["completed-pomos"]}>
            <span className={styles["title"]}>Today's Pomodoros: </span>

            {ePomos === 0 && cPomos === 0 && 
                (<span>You haven't added estimates yet.</span>)
                ||
                <div className={styles["circles"]}>
                {[...Array(cPomos)].map((item, index) => (<div key={`completed-pomo-${index}`} className={styles["round-border"]+' '+styles["filled"]}>{index+1}</div>))}
                {/* {ePomos > cPomos && [...Array(ePomos - cPomos)].map((item, index) => (<span key={`pending-pomo-${index}`} className="round-border"></span>))} */}
                </div>
            }
            
        </div>
    )
}