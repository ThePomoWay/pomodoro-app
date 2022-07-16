import { ClickAwayListener } from "@material-ui/core";
import { Popper } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useMediaQuery } from "react-responsive";
import { selectTheme, selectUserInfo } from "../../state/selectors";
import { setSettingsModal } from "../../state/slice/GlobalSlice";
import { logout } from "../../state/thunks/GlobalThunk";
import { ProfileHamburger } from "../../svgs/ProfileHamburger";
import { THEME_LIGHT } from "../../utils/constants";
import styles from "./ProfileDropdown.module.scss";

export function ProfileDropdown(props) {
  let [profileAnchorEl, setProfileAnchorEl] = useState(false);
  let userInfo = useSelector(selectUserInfo);
  let theme = useSelector(selectTheme);

  const isMobileDevice = useMediaQuery({
    query: "(max-device-width: 899px)",
  });

  const onClose = () => {
    setProfileAnchorEl(null);
  };

  let dispatch = useDispatch();

  let onLogout = () => {
    dispatch(logout());
  };

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
                  href="mailto:feedback@timedojo.io"
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
