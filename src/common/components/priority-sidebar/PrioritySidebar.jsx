import { Link } from "react-router-dom";
import { PriorityIcon } from "../../svgs/PriorityIcon";
import { priorityColorMap, priorityName } from "../../utils/constants";
import styles from "./PrioritiesSidebar.module.scss";

export function PrioritySidebar(props) {
  // let [priorityExpanded, setPriorityExpanded] = useState(true);

  let priorities = priorityColorMap;

  let pathname = window.location.pathname;
  let selectedPriority = Number(pathname.split("/all/priority/")[1]);

  const getPriorities = () => {
    return (
      <div>
        {[...Array(priorities.length - 1)].map((item, index) => (
          <Link key={`sidebar-${index}`} to={`/all/priority/${index + 1}`}>
            <div
              className={`${styles["priority"]} ${
                selectedPriority === index + 1 && styles["selected"]
              }`}
            >
              <PriorityIcon style={{ fill: priorities[index + 1] }} />
              {priorityName[index]}
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className={styles["priorities-sidebar"]}>
        <PriorityIcon style={{ fill: "white" }} />
        Priorities
        {/* <span
          onClick={(e) => setPriorityExpanded(!priorityExpanded)}
          className={`${styles["accordion"]} ${
            priorityExpanded ? "up-arrow" : "down-arrow"
          }`}
        ></span> */}
      </div>
      <div className={styles["priorities-sidebar-second"]}>
        {getPriorities()}
      </div>
    </div>
  );
}
