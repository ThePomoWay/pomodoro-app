import { Done, Label } from "@mui/icons-material";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import AuthService from "../../API/network/AuthService";
import { PriorityFlag } from "../../svgs/PriorityFlag";
import { priorityColorMap, priorityName } from "../../utils/constants";
import styles from "./PrioritySelector.module.scss";
import { openOnboardingModal } from "../../state/slice/GlobalSlice";
import { PriorityIcon } from "../../svgs/PriorityIcon";

export function PrioritySelector(props) {
  let priorities = priorityColorMap;

  let selected = props.priority;

  const onPriorityClick = useCallback((item) => {
    props.onChange && props.onChange(item);
  });

  let dispatch = useDispatch();
  let onLogin = () => {
    dispatch(openOnboardingModal());
  };

  if (!AuthService.isLoggedIn()) {
    return (
      <div className="popover">
        <div className="popover-title">
          <p>
            <a
              href="javascript:void(0)"
              className={styles["login"]}
              onClick={(e) => onLogin()}
            >
              Login
            </a>{" "}
            to add priority
          </p>
        </div>
      </div>
    );
  }

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
          <PriorityIcon style={{ fill: priorities[index + 1] }} />

          <span> {priorityName[index]}</span>
          {selected === index + 1 && <Done className="popover-select-tick" />}
        </div>
      ))}
    </div>
  );
}
