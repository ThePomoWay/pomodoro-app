/* eslint-disable jsx-a11y/accessible-emoji */

import Modal from "@mui/material/Modal";
import { useCallback } from "react";

import styles from "./onboarding.module.scss";
import { useDispatch, useSelector } from "react-redux";

import { selectOnboardingOpen, selectStep } from "../../common/state/selectors";

import { Close } from "@material-ui/icons";

import { LoginStep } from "./login/login-step";
import { SignupStep2 } from "./signup/signup-step-2";
import { ForgotPasswordStep1 } from "./forgot-password/forgot-password-step-1";
import { ForgotPasswordStep2 } from "./forgot-password/forgot-password-step-2";
import { LoginStep2 } from "./login/login-step-2";
import {
  FORGOT_PASSWORD_STEP_1,
  FORGOT_PASSWORD_STEP_2,
  LOGIN_REGISTER_STEP,
  LOGIN_STEP,
  REGISTER_STEP,
} from "../../common/utils/constants";
import { closeOnboardingModal } from "../../common/state/slice/GlobalSlice";
import { useMediaQuery } from "react-responsive";
import { setStep } from "../../common/state/slice/OnboardingSlice";
import { CloseIcon } from "../../common/svgs/CloseIcon";

const onSubmit = async (values) => {
  window.alert(JSON.stringify(values, 0, 2));
};

export default function OnBoarding(props) {
  let dispatch = useDispatch();

  let isModalOpen = useSelector(selectOnboardingOpen);

  let step = useSelector(selectStep);

  const handleClose = useCallback(() => {
    dispatch(setStep(1));
    dispatch(closeOnboardingModal());
  });

  const isMobileDevice = useMediaQuery({
    query: "(max-device-width: 1224px)",
  });

  const isDesktop = useMediaQuery({
    query: "(min-device-width: 1200px)",
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
            {" "}
            <CloseIcon />{" "}
          </span>
          {(step === LOGIN_REGISTER_STEP && <LoginStep />) ||
            (step === LOGIN_STEP && <LoginStep2 />) ||
            (step === REGISTER_STEP && <SignupStep2 />) ||
            (step === FORGOT_PASSWORD_STEP_1 && <ForgotPasswordStep1 />) ||
            (step === FORGOT_PASSWORD_STEP_2 && <ForgotPasswordStep2 />)}
        </div>
      </div>
    </Modal>
  );
}
