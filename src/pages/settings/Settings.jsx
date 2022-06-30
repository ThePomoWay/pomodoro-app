import { SettingsSideNav } from "../../common/components/settings-side-nav/SettingsSideNav";
import styles from "./Settings.module.scss";

import { Modal } from "@mui/material";
import { ClockSettingsModal } from "../../common/components/clock-settings-modal/ClockSettingsModal";
import { PaymentSettings } from "../../common/components/payment-settings/PaymentSettings";
import { ProfileSettings } from "../../common/components/profile-settings/ProfileSettings";

import { useDispatch, useSelector } from "react-redux";
import {
  selectSettingsModal,
  selectSettingsTab,
} from "../../common/state/selectors";
import { setSettingsModal } from "../../common/state/slice/GlobalSlice";
import { CloseIcon } from "../../common/svgs/CloseIcon";

export default function Settings(props) {
  let isModalOpen = useSelector(selectSettingsModal);
  let tab = useSelector(selectSettingsTab);
  let dispatch = useDispatch();
  let handleClose = () => {
    dispatch(setSettingsModal(false));
  };
  return (
    <Modal
      open={isModalOpen}
      onClose={props.handleClose}
      aria-labelledby="clock-settings"
      aria-describedby="Change timer length for work time, short and long breaks."
    >
      <div className="modal-container medium-modal">
        <span className="close" onClick={(e) => handleClose()}>
          <CloseIcon />
        </span>
        <div className={styles["settings-container"]}>
          <div className={styles["main"]}>
            <div className={styles["sidebar"]}>
              <SettingsSideNav />
            </div>
            <div className={styles["settings"]}>
              {tab === 0 && <ProfileSettings />}
              {tab === 1 && <ClockSettingsModal />}
              {tab === 2 && <PaymentSettings />}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
