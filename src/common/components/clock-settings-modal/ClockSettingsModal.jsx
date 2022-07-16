import { Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectClockSettingsModal } from "../../state/selectors";
import { hideClockSettingsModal } from "../../state/slice/GlobalSlice";
import { CloseIcon } from "../../svgs/CloseIcon";
import { ClockSettings } from "../clock-setting/ClockSettings";
import styles from "./ClockSettings.module.scss";

export default function ClockSettingsModal() {
  let isModalOpen = useSelector(selectClockSettingsModal);

  let dispatch = useDispatch();
  let handleClose = () => {
    dispatch(hideClockSettingsModal());
  };
  return (
    <Modal
      open={isModalOpen}
      onClose={handleClose}
      aria-labelledby="clock-settings"
      aria-describedby="Change timer length for work time, short and long breaks."
    >
      <div className="modal-container medium-modal">
        <div className="close" onClick={handleClose}>
          <CloseIcon />
        </div>
        <div className={styles["container"]}>
          <ClockSettings hideSidebar={true} />
        </div>
      </div>
    </Modal>
  );
}
