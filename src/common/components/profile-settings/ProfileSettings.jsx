import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInfo } from "../../state/selectors";
import { clearAllData } from "../../state/thunks/GlobalThunk";
import { ClockSettingsModal } from "../clock-settings-modal/ClockSettingsModal";
import styles from "./ProfileSettings.module.scss";

export function ProfileSettings(props) {
  let [isModalOpen, setIsModalOpen] = useState(false);

  let user = useSelector(selectUserInfo);
  let [name, setName] = useState(user.name);
  let [email, setEmail] = useState(user.email);

  let dispatch = useDispatch();

  useEffect(() => {
    setName(user.name);

    setEmail(user.email);
  }, [user]);

  let openModal = () => {
    setIsModalOpen(true);
  };
  let closeModal = () => {
    setIsModalOpen(false);
  };

  let clearAll = () => {
    dispatch(clearAllData());
  };
  return (
    <div className={styles["settings"]}>
      <div className={styles["account"]}>
        <div className="font-heading">Account</div>
      </div>
      <div className={styles["profile"]}>
        <div className={`font-sub-heading ${styles["subtitle"]}`}>Avatar</div>
        <div className={styles["profile-settings"]}>
          <img
            src={user.dp || "/default.png"}
            className={styles["profile-icon"]}
          />
          <button className="btn btn-save">Replace</button>
        </div>
      </div>

      <div className={styles["hr"]}></div>
      <div className={styles["form"]}>
        <div className={styles["name"]}>
          <div className={`font-info ${styles["label"]}`}>Display Name</div>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.currentValue)}
          />
        </div>
        <div className={styles["email"]}>
          <div className={`font-info ${styles["label"]}`}>Email</div>
          <input className="input" value={email} disabled />
        </div>
      </div>

      <div className={styles["hr"]}></div>
      <div className={styles["clock-settings"]}>
        <div className="font-sub-heading">Clear all data</div>
        <div className="font-light">Clear all your tasks, lists and tags.</div>
        <button className="btn btn-save" onClick={clearAll}>
          Clear Data
        </button>
      </div>
    </div>
  );
}
