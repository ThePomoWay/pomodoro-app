import { Modal } from "@mui/material";
import { Close } from "@material-ui/icons";
import styles from "./Alert.module.scss";

export function Alert(props) {
  return (
    <Modal
      open={!!props.showModal}
      onClose={props.onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="modal-container">
        <div className="modal-title">
          <p>
            {props.title || "Are you sure you want to perform this action?"}
          </p>
          <Close style={{ cursor: "pointer" }} onClick={props.onClose} />
        </div>
        <div className="modal-description">
          {props.description || "You cannot undo this action."}
        </div>
        <div className={styles["cta"]}>
          <button
            className="btn btn-cancel"
            onClick={(e) => props.onClose && props.onClose()}
          >
            CANCEL
          </button>
          <button
            className="btn btn-save"
            onClick={(e) => props.onSuccess && props.onSuccess()}
          >
            DELETE
          </button>
        </div>
      </div>
    </Modal>
  );
}
