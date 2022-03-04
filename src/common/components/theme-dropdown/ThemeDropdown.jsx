import { ClickAwayListener } from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
import { Popper } from "@mui/material";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme } from "../../state/selectors";
import { setTheme } from "../../state/slices/GlobalThunk";
import { THEME_DARK, THEME_LIGHT } from "../../utils/constants";

import styles from "../profile-dropdown/ProfileDropdown.module.scss";

export function ThemeDropdown({}) {
  let [themeAnchorEl, setThemeAnchorEl] = useState(false);
  let theme = useSelector(selectTheme);

  const onClose = useCallback(() => {
    setThemeAnchorEl(null);
  });

  let dispatch = useDispatch();

  let switchTheme = (theme) => {
    dispatch(setTheme(theme));
  };

  return (
    <div className={styles["profile"]}>
      <ClickAwayListener onClickAway={onClose}>
        <div>
          <div
            className="flex flex-center"
            onClick={(e) => setThemeAnchorEl(e.currentTarget)}
          >
            <p>Theme</p>
            <span className={`${styles["arrow"]}`}>
              <ArrowDropDown />
            </span>
          </div>

          <Popper
            open={Boolean(themeAnchorEl)}
            id="project-popover"
            anchorEl={themeAnchorEl}
            onClose={onClose}
            position="bottom-left"
          >
            <div
              className="popper-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="popper-item"
                onClick={(e) => switchTheme(THEME_LIGHT)}
              >
                Light Theme
              </div>
              <div
                className="popper-item"
                onClick={(e) => switchTheme(THEME_DARK)}
              >
                Dark Theme
              </div>
            </div>
          </Popper>
        </div>
      </ClickAwayListener>
    </div>
  );
}
