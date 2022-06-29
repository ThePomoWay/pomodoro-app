import { Modal } from "@mui/material";
import { useSelector } from "react-redux";
import { selectIsMultiTabAlertModalOpen } from "../../state/selectors";
import styles from "./MultiTabAlertModal.module.scss";

export function MultiTabAlertModal() {
  let isModalOpen = useSelector(selectIsMultiTabAlertModalOpen);

  let handleClose = () => {
    // dispatch(setMultiTabAlertModal(false));
  };
  let useHere = () => {
    window.location.reload();
  };
  return (
    <Modal open={isModalOpen} onClose={handleClose}>
      <div className="modal-container">
        <div className="modal-content">
          <div className={styles["container"]}>
            <p className="font-small-heading">
              Your session is active on another tab!
            </p>

            <button
              className={`btn btn-save ${styles["btn"]}`}
              onClick={useHere}
            >
              Use Here
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
