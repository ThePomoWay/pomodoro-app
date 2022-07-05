import { Modal } from "@mui/material";

import { ReactComponent as AwardSvg } from "../../svgs/PerfectDay.svg";

export function AwardsModal(props) {
  return (
    <Modal
      open={isModalOpen}
      onClose={props.handleClose}
      aria-labelledby="Awards Modal"
      aria-describedby="Award modal"
    >
      <div className="modal-container">
        <span className="close" onClick={(e) => handleClose()}>
          <CloseIcon />
        </span>
        <div className={styles["award-container"]}>
          <div className={styles["title"]}>Congratulations!</div>
          <AwardSvg />
          <div className={styles["desc"]}>
            You completed all your tasks today. We salute your hard work. Share
            this achievement with you friends and network.
          </div>
        </div>
      </div>
    </Modal>
  );
}
