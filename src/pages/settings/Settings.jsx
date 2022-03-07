import { Slider } from "@material-ui/core";
import { SettingsSideNav } from "../../common/components/settings-side-nav/SettingsSideNav";
import styles from "./Settings.module.scss";

import { Switch, Route, useRouteMatch } from "react-router-dom";
import Navbar from "../../common/components/navbar/Navbar";
import { ProfileSettings } from "../../common/components/profile-settings/ProfileSettings";
import { ClockSettings } from "../../common/components/clock-settings/ClockSettings";
import { SoundSettings } from "../../common/components/sound-settings/SoundSettings";
import { ClockSettingsModal } from "../../common/components/clock-settings-modal/ClockSettingsModal";
import { Modal } from "@mui/material";

import { useSelector } from "react-redux";
import {
  selectSettingsModal,
  selectSettingsTab,
} from "../../common/state/selectors";

export default function Settings(props) {
  let { path } = useRouteMatch();

  let isModalOpen = useSelector(selectSettingsModal);
  let tab = useSelector(selectSettingsTab);
  return (
    <Modal
      open={isModalOpen}
      onClose={props.handleClose}
      aria-labelledby="clock-settings"
      aria-describedby="Change timer length for work time, short and long breaks."
    >
      <div className="modal-container">
        <div className="modal-content">
          <div className={styles["settings-container"]}>
            <div className={styles["main"]}>
              <div className={styles["sidebar"]}>
                <SettingsSideNav />
              </div>
              <div className={styles["settings"]}>
                {tab === 0 && <ProfileSettings />}
                {tab === 1 && <ClockSettingsModal />}
                {tab === 2 && <SoundSettings />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
