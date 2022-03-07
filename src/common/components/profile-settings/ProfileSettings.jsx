import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../state/selectors";
import { ClockSettingsModal } from "../clock-settings-modal/ClockSettingsModal";
import styles from "./ProfileSettings.module.scss";

export function ProfileSettings(props) {
  let [isModalOpen, setIsModalOpen] = useState(false);

  let user = useSelector(selectUserInfo);
  console.log(user);

  let openModal = () => {
    setIsModalOpen(true);
  };
  let closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className={styles["settings"]}>
      <ClockSettingsModal isModalOpen={isModalOpen} handleClose={closeModal} />
      <div className={styles["account"]}>
        <div className="font-sub-heading">Account</div>
      </div>
      <div className={styles["profile"]}>
        <div className="font-normal">Avatar</div>
        <div className={styles["profile-settings"]}>
          <img
            src={user.dp || "/default.png"}
            className={styles["profile-icon"]}
          />
          <button className="btn btn-save">Replace</button>

          <button className="btn btn-cancel">Cancel</button>
        </div>
      </div>
      <button className="btn btn-save" onClick={openModal}>
        Open Modal
      </button>
    </div>
  );
}
