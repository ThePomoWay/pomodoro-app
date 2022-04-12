import { Modal } from "@mui/material";
import { CloseIcon } from "../../svgs/CloseIcon";
import styles from "./Alert.module.scss";

export function Alert({
  showModal,
  onClose,
  onSuccess,
  cta,
  title,
  description,
}) {
  return (
    <Modal
      open={!!showModal}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="modal-container">
        <CloseIcon
          style={{ cursor: "pointer" }}
          className="close"
          onClick={onClose}
        />
        <div className="modal-content">
          <div className="modal-title">
            <p>{title || "Are you sure you want to perform this action?"}</p>
          </div>
          <div className="modal-description">
            {description || "You cannot undo this action."}
          </div>
          <div className={styles["cta"]}>
            <button
              className="btn btn-cancel"
              onClick={(e) => onClose && onClose()}
            >
              CANCEL
            </button>
            <button
              className="btn btn-save"
              onClick={(e) => onSuccess && onSuccess()}
            >
              {cta || "DELETE"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
