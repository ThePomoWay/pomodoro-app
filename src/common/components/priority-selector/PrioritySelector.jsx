import { Done, Label } from "@material-ui/icons";
import { useCallback } from "react";
import { PriorityFlag } from "../../svgs/PriorityFlag";
import { priorityColorMap } from "../../utils/constants";
import styles from "./PrioritySelector.module.scss";

export function PrioritySelector(props) {
  let priorities = priorityColorMap;

  let selected = props.priority;

  const onPriorityClick = useCallback((item) => {
    props.onChange && props.onChange(item);
  });

  return (
    <div className={`${styles["container"]} popover`}>
      <div className="popover-title">Select a priority</div>
      {[...Array(priorities.length - 1)].map((item, index) => (
        <div
          key={"priority" + index}
          className={`${styles["priority"]} popover-icon-item ${
            selected === index + 1 && "popover-normal-item-selected"
          }`}
          onClick={(e) => onPriorityClick(index + 1)}
        >
          <PriorityFlag style={{ fill: priorities[index + 1] }} />

          <span>Priority {index + 1}</span>
          {selected === index + 1 && <Done className="popover-select-tick" />}
        </div>
      ))}
    </div>
  );
}
