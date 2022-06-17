import { Close } from "@material-ui/icons";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { selectIsExtensionModalOpen } from "../../state/selectors";
import { setIsExtensionModalOpen } from "../../state/slice/GlobalSlice";
import { AnalyzeIcon } from "../../svgs/AnalyzeIcon";
import { BlockIcon } from "../../svgs/BlockIcon";
import { UnlockNewIcon } from "../../svgs/UnlockNewIcon";
import styles from "./ExtensionModal.module.scss";
export function ExtensionModal(props) {
  let isModalOpen = useSelector(selectIsExtensionModalOpen);

  let dispatch = useDispatch();
  let handleClose = () => {
    dispatch(setIsExtensionModalOpen(false));
  };

  let openChromeStore = () => {
    window.open(
      "https://chrome.google.com/webstore/detail/timedojo-pomodoro-app-to/cennnfekpcbgoajenlkfhhgcpmjddhfh?hl=en-GB&authuser=3"
    );
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="modal-container">
        <div className="modal-content">
          <span className="close" onClick={(e) => handleClose()}>
            {" "}
            <Close />{" "}
          </span>

          <p className="font-sub-heading">
            Avoid distractions and focus better by using our{" "}
            <span className="logo">Chrome Extension</span>
          </p>
          <div className={styles["promo"]}>
            {/* <img className={styles["img"]} src="/promo-panda.png" /> */}
            <div className={styles["features"]}>
              <div className={styles["feature"]}>
                <BlockIcon />
                <span>
                  Block websites during your pomodoro session using the
                  extension.
                </span>
              </div>
              <div className={styles["feature"]}>
                <AnalyzeIcon />
                <span>Analyze your time spent on websites</span>
              </div>
              <div className={styles["feature"]}>
                <UnlockNewIcon />
                <span>Manage pomodoro timer easily!</span>
              </div>
            </div>
          </div>
          <div className={styles["cta"]} onClick={(e) => openChromeStore()}>
            <button className="btn btn-save">Download Extension</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
