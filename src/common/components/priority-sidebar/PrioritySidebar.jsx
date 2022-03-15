import {
  AddCircleOutlineOutlined,
  Flag,
  FlagOutlined,
  Label,
  LabelOutlined,
} from "@material-ui/icons";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { selectTagsAsArr } from "../../state/selectors";
import { Link } from "react-router-dom";
import styles from "./PrioritiesSidebar.module.scss";
import { priorityColorMap, priorityName } from "../../utils/constants";
import { PriorityIcon } from "../../svgs/PriorityIcon";

export function PrioritySidebar(props) {
  let [priorityExpanded, setPriorityExpanded] = useState(true);

  let priorities = priorityColorMap;

  let pathname = window.location.pathname;
  let selectedPriority = Number(pathname.split("/all/priority/")[1]);

  const getPriorities = useCallback(() => {
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
  });

  return (
    <div>
      <div className={styles["priorities-sidebar"]}>
        <FlagOutlined />
        Priorities
        {/* <span
          onClick={(e) => setPriorityExpanded(!priorityExpanded)}
          className={`${styles["accordion"]} ${
            priorityExpanded ? "up-arrow" : "down-arrow"
          }`}
        ></span> */}
      </div>
      <div className={styles["priorities-sidebar-second"]}>
        {priorityExpanded && getPriorities()}
      </div>
    </div>
  );
}
