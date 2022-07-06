import { Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { selectTransactionModal } from "../../state/selectors";
import { closeTransactionModal } from "../../state/slice/GlobalSlice";
import { CloseIcon } from "../../svgs/CloseIcon";

import { ReactComponent as PricingRibbon } from "../../svgs/pricing-ribbon.svg";
import { TransactionFailure } from "./TransactionFailure";
import { TransactionSuccess } from "./TransactionSuccess";

export function TransactionModal(props) {
  let modalState = useSelector(selectTransactionModal);
  let dispatch = useDispatch();

  let handleClose = () => {
    dispatch(closeTransactionModal());
  };

  const isMobileDevice = useMediaQuery({
    query: "(max-device-width: 1224px)",
  });

  return (
    <Modal
      open={modalState.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div
        className={
          isMobileDevice ? "modal-container-mobile" : "modal-container"
        }
      >
        <div className="modal-content">
          <span className="close" onClick={(e) => handleClose()}>
            <CloseIcon />
          </span>
          {(modalState.type === "success" && (
            <TransactionSuccess handleClose={handleClose} />
          )) || <TransactionFailure />}
        </div>
      </div>
    </Modal>
  );
}
