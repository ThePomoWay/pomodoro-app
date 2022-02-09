import { Add } from "@material-ui/icons";
import { Popover } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";

import styles from "./estimatedPomos.module.scss";

export default (props) => {
  let [defaultPomos, setDefaultPomos] = useState(Number(props.default) || 5);
  let [checkedPomos, setCheckedPomos] = useState(-1);
  let [hoverPomos, setHoverPomos] = useState(-1);
  let [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    setCheckedPomos(props.value - 1);
  }, [props.value]);

  let onHover = useCallback((i) => {
    setHoverPomos(i);
  });

  let onMouseLeave = useCallback(() => {
    setHoverPomos(-1);
  });

  let onClick = useCallback((i) => {
    setCheckedPomos(i);
    props.onClick && props.onClick(i + 1);
  });
  let onPopoverOpen = useCallback((e) => {
    setAnchorEl(e.currentTarget);
  });

  let decrementMaxPomos = () => {
    setDefaultPomos(defaultPomos - 1);
  };
  let incrementMaxPomos = () => {
    setDefaultPomos(defaultPomos + 1);
  };
  // setDefaultPomos(defaultPomos + 1);

  let handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <span className="w-100 flex">
      {[...Array(defaultPomos)].map((e, i) => (
        <div
          key={i}
          className={`${styles.item} circle flex flex-center ${
            i <= checkedPomos || i <= hoverPomos ? styles["circle-filled"] : ""
          }`}
          onMouseEnter={() => onHover(i)}
          onMouseLeave={() => onMouseLeave()}
          onClick={() => onClick(i)}
        >
          {(i <= hoverPomos || i <= checkedPomos) && i + 1}
        </div>
      ))}

      <Popover
        open={Boolean(anchorEl)}
        id="more-options-popover"
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <div className={styles["add-max-pomos"]}>
          <span
            className={styles["minus-icon"]}
            style={{ cursor: "pointer" }}
            onClick={decrementMaxPomos}
          >
            <svg
              width="4"
              height="2"
              viewBox="0 0 4 2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.41797 1.81836H0.558594V0.933594H3.41797V1.81836Z"
                fill="#5F6BC9"
              />
            </svg>
          </span>
          <div className={`${styles["epomo-circle"]} flex flex-center`}>
            {defaultPomos}
          </div>
          <svg
            width="7"
            height="8"
            viewBox="0 0 7 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ cursor: "pointer" }}
            onClick={incrementMaxPomos}
          >
            <path
              d="M4.02148 3.42383H6.40039V4.44922H4.02148V7.14453H2.93164V4.44922H0.552734V3.42383H2.93164V0.933594H4.02148V3.42383Z"
              fill="#5F6BC9"
            />
          </svg>
        </div>
      </Popover>
      <span className={styles["add"]} onClick={onPopoverOpen}>
        <Add style={{ width: "16px", height: "16px" }} />
      </span>
    </span>
  );
};
