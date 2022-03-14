import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInfo } from "../../state/selectors";
import { clearAllData } from "../../state/thunks/GlobalThunk";
import styles from "./ProfileSettings.module.scss";
import { Transition } from "react-transition-group";
import { ProfilePicSelector } from "../profile-pic-selector/ProfilePicSelector";
import { EditRounded } from "../../svgs/EditRounded";

const dpTransitionStyles = {
  entering: {
    transform: "translateX(300px)",
    opacity: 0,
    position: "absolute",
  },
  entered: { transform: "translateX(0px)", opacity: 1, position: "absolute" },
  exiting: { transform: "translateX(0px)", opacity: 1, position: "absolute" },
  exited: { transform: "translateX(300px)", opacity: 0, position: "absolute" },
};
const profileTransitionStyles = {
  entering: {
    transform: "translateX(-500px)",
    opacity: 0,
  },
  entered: { transform: "translateX(0px)", opacity: 1, position: "absolute" },
  exiting: { transform: "translateX(0px)", opacity: 0, position: "absolute" },
  exited: { transform: "translateX(-500px)", opacity: 0, position: "absolute" },
};
export function ProfileSettings(props) {
  let [isModalOpen, setIsModalOpen] = useState(false);

  let user = useSelector(selectUserInfo);
  let [name, setName] = useState(user.name);
  let [email, setEmail] = useState(user.email);

  let [isProfileScreen, setIsProfileScreen] = useState(true);
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
    <div style={{ position: "relative" }}>
      <Transition in={!isProfileScreen} timeout={50}>
        {(state) => (
          <div
            className={styles["animate-wrapper"]}
            style={{ ...dpTransitionStyles[state] }}
          >
            <ProfilePicSelector onSave={(e) => setIsProfileScreen(true)} />
          </div>
        )}
      </Transition>
      <Transition in={isProfileScreen} timeout={50}>
        {(state) => (
          <div
            className={styles["settings"]}
            style={{ ...profileTransitionStyles[state] }}
          >
            <div className={styles["account"]}>
              <div className="font-small-heading">My Profile</div>
            </div>
            <div className={styles["hr"]}></div>
            <div className={styles["profile"]}>
              <div className={`${styles["subtitle"]}`}>Avatar</div>
              <div className={styles["profile-settings"]}>
                <div
                  className={styles["profile-img"]}
                  onClick={(e) => setIsProfileScreen(false)}
                >
                  <img
                    src={user.image || "/default.png"}
                    className={styles["profile-icon"]}
                  />
                  <div className={styles["edit-icon"]}>
                    <EditRounded />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles["hr"]}></div>
            <div className={styles["form"]}>
              <div className={styles["name"]}>
                <div className={`${styles["subtitle"]}`}>Display Name</div>
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.currentValue)}
                />
              </div>
            </div>

            <div className={styles["hr"]}></div>
            <div className={styles["email"]}>
              <div>
                <div className={` ${styles["subtitle"]}`}>Email</div>
                <input className="input" value={email} disabled />
              </div>
            </div>
            {/* <div className={styles["clock-settings"]}>
              <div className="font-sub-heading">Clear all data</div>
              <div className="font-light">
                Clear all your tasks, lists and tags.
              </div>
              <button className="btn btn-save" onClick={clearAll}>
                Clear Data
              </button>
            </div> */}
          </div>
        )}
      </Transition>
    </div>
  );
}
