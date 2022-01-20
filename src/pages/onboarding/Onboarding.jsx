/* eslint-disable jsx-a11y/accessible-emoji */
import { TextField } from "@material-ui/core";
import Modal from "@mui/material/Modal";
import React, { useCallback, useState } from "react";

import styles from "./onboarding.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { closeOnboardingModal, signin } from "../../common/state/slices/GlobalSlice";
import { selectOnboardingOpen, selectStep } from "../../common/state/selectors";

import {Close} from "@material-ui/icons";
import { LoginForm } from "../../common/components/login-form/LoginForm";
import { SignupForm } from "../../common/components/signup-form/SignupForm";

import {LoginStep} from "./login/login-step";
import { SignupStep1 } from "./signup/signup-step-1";
import { SignupStep2 } from "./signup/signup-step-2";

const onSubmit = async (values) => {
  window.alert(JSON.stringify(values, 0, 2));
};

export default function OnBoarding(props) {

  let dispatch = useDispatch();

  let isModalOpen = useSelector(selectOnboardingOpen);

  let step = useSelector(selectStep);

  const handleClose = useCallback(() => {
      dispatch(closeOnboardingModal());
  })
return (
    <Modal
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <div className={`${styles['form-wrapper']}`}>
                <span className={styles['close']} onClick={(e) => handleClose()}> <Close /> </span>

                {(step === 1 && (<LoginStep />)) || 
                (step === 2 && (<SignupStep2 />)) || 
                (step === 3 && (<LoginStep />)) || 
                (step === 4 && (<LoginStep />)) }
            </div>
    </Modal>
  );
};
