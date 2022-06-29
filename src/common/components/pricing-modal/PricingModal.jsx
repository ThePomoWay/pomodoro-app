/* eslint-disable jsx-a11y/accessible-emoji */

import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { selectPricingModalOpen } from "../../state/selectors";
import { setPricingModalState } from "../../state/slice/GlobalSlice";
import { CloseIcon } from "../../svgs/CloseIcon";
import { PricingContainer } from "../pricing-container/PricingContainer";

export default function PricingModal(props) {
  let dispatch = useDispatch();

  let isModalOpen = useSelector(selectPricingModalOpen);

  let handleClose = () => {
    dispatch(setPricingModalState(false));
  };

  const isMobileDevice = useMediaQuery({
    query: "(max-device-width: 1224px)",
  });

  return (
    <Modal
      open={isModalOpen}
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
          <PricingContainer />
        </div>
      </div>
    </Modal>
  );
}
