import styles from "./signup.module.scss";

import { Field, Form } from "react-final-form";
import { TextField } from "mui-rff";
import { useCallback, useState } from "react";
import {
  register,
  setStep,
} from "../../../common/state/slices/OnboardingSlice";
import { useDispatch } from "react-redux";
import { LOGIN_REGISTER_STEP } from "../../../common/utils/constants";
import { ChevronLeft } from "../../../common/svgs/ChevronLeft";
import { SentimentSatisfied } from "@material-ui/icons";

export function SignupStep2(props) {
  let [nameError, setNameError] = useState(false);
  let [passwordError, setPasswordError] = useState(false);

  let dispatch = useDispatch();

  let validate = (vals) => {
    return (
      vals.name &&
      vals.name.length > 0 &&
      vals.password &&
      vals.password.length >= 8
    );
  };
  let onSubmit = useCallback((vals) => {
    if (vals.name && vals.name.length && vals.password.length >= 8) {
      dispatch(register(vals));
    } else {
      if (!vals.name || !vals.name.length) {
        setNameError("Please enter your name");
      } else {
        setNameError("");
      }

      if (vals.password.length < 8) {
        setPasswordError("Password must have at least 8 characters");
      } else {
        setPasswordError("");
      }
    }
  });

  let goBack = () => {
    dispatch(setStep(LOGIN_REGISTER_STEP));
  };

  return (
    <div className={styles["container"]}>
      <span className={styles["welcome-text"]}>
        <ChevronLeft onClick={goBack} style={{ cursor: "pointer" }} />
        <span>Almost there!</span>
      </span>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          name: "",
          password: "",
        }}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit} className={styles["form"]}>
            <div>
              <Field name="name" type="text" placeholder="Enter your Name">
                {({ input, meta }) => (
                  <input
                    className={`input ${styles["name"]}`}
                    name={input.name}
                    value={input.value}
                    onChange={input.onChange}
                    placeholder="Enter your name"
                  />
                )}
              </Field>
              {nameError && <p className={styles["error-text"]}>{nameError}</p>}
              <Field
                name="password"
                type="password"
                placeholder="Enter your Password"
              >
                {({ input, meta }) => (
                  <input
                    className={`input ${styles["password"]}`}
                    name={input.name}
                    value={input.value}
                    onChange={input.onChange}
                    label="Password"
                    type="password"
                    placeholder="Enter Password"
                  />
                )}
              </Field>
              {passwordError && (
                <p className={styles["error-text"]}>{passwordError}</p>
              )}
            </div>
            <div className={styles["cta"]}>
              <button
                className="btn btn-login"
                type="submit"
                disabled={submitting || pristine}
                onClick={handleSubmit}
              >
                Register
              </button>
            </div>
          </form>
        )}
      ></Form>
    </div>
  );
}
