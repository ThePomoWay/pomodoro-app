import { ClickAwayListener } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import { Popper } from "@mui/material";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../API/network/AuthService";

import { Link } from "react-router-dom";

import styles from "./ProfileDropdown.module.scss";
import { logout } from "../../state/thunks/GlobalThunk";
import { setSettingsModal } from "../../state/slice/GlobalSlice";
import { selectUserInfo, selectTheme } from "../../state/selectors";
import { ProfileHamburger } from "../../svgs/ProfileHamburger";
import { THEME_LIGHT } from "../../utils/constants";
import { useMediaQuery } from "react-responsive";

export function ProfileDropdown(props) {
  let [profileAnchorEl, setProfileAnchorEl] = useState(false);
  let userInfo = useSelector(selectUserInfo);
  let theme = useSelector(selectTheme);

  const isMobileDevice = useMediaQuery({
    query: "(max-device-width: 899px)",
  });

  const onClose = useCallback(() => {
    setProfileAnchorEl(null);
  });

  let dispatch = useDispatch();

  let onLogout = useCallback(() => {
    dispatch(logout());
  });

  let openSettings = () => {
    dispatch(setSettingsModal(true));
  };

  return (
    <div className={styles["profile"]}>
      <ClickAwayListener onClickAway={onClose}>
        <div>
          <div
            className={styles["profile-elipse"]}
            onClick={(e) => setProfileAnchorEl(e.currentTarget)}
          >
            <ProfileHamburger
              stroke={theme === THEME_LIGHT ? "black" : "white"}
            />
            <img src={(userInfo && userInfo.image) || "/dp/1.png"} />
            {/* <span className={`${styles["arrow"]}`}>
              <ArrowDropDown />
            </span> */}
          </div>

          <Popper
            open={Boolean(profileAnchorEl)}
            id="project-popover"
            anchorEl={profileAnchorEl}
            onClose={onClose}
            position="bottom-left"
            className="popper"
          >
            <div
              className="popper-container"
              onClick={(e) => e.stopPropagation()}
            >
              {!isMobileDevice && (
                <div className="popper-item" onClick={openSettings}>
                  Settings
                </div>
              )}

              {!isMobileDevice && (
                <a
                  className="popper-item"
                  href="mailto:feedback@focuslounge.in"
                  target="_blank"
                >
                  Send Feedback ❤️
                </a>
              )}

              <div className="popper-item" onClick={(e) => onLogout()}>
                Logout
              </div>
            </div>
          </Popper>
        </div>
      </ClickAwayListener>
    </div>
  );
}
