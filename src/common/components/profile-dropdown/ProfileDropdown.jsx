import { ClickAwayListener } from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
import { Popper } from "@mui/material";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../API/network/AuthService";

import { Link } from "react-router-dom";

import styles from "./ProfileDropdown.module.scss";
import { logout } from "../../state/thunks/GlobalThunk";
import { setSettingsModal } from "../../state/slice/GlobalSlice";
import { selectUserInfo } from "../../state/selectors";
import { ProfileHamburger } from "../../svgs/ProfileHamburger";

export function ProfileDropdown(props) {
  let [profileAnchorEl, setProfileAnchorEl] = useState(false);
  let userInfo = useSelector(selectUserInfo);

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
            <ProfileHamburger />
            <img src={(userInfo && userInfo.image) || "/dp/1.jpg"} />
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
          >
            <div
              className="popper-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="popper-item" onClick={openSettings}>
                Settings
              </div>

              <a
                className="popper-item"
                href="mailto:feedback@timedojo.io"
                target="_blank"
              >
                Send Feedback ❤️
              </a>

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
