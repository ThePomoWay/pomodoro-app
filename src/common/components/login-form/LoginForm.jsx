import styles from "./LoginForm.module.scss";
import { Form, Field } from "react-final-form";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { setStep, registerCheck } from "../../state/slices/OnboardingSlice";
import { validateEmail } from "../../utils/validators";
import { FORGOT_PASSWORD_STEP_1 } from "../../utils/constants";

export function LoginForm(props) {
  let formData = {
    email: "",
    password: "",
  };

  let [emailError, setEmailError] = useState(false);

  let dispatch = useDispatch();

  let onSubmit = useCallback((vals) => {
    if (validate(vals)) {
      setEmailError("Please enter a valid email");
    } else {
      dispatch(registerCheck(vals.email));
    }
  });

  let validate = useCallback((vals) => {
    return !validateEmail(vals.email);
  });

  let initiatePasswordChange = useCallback(() => {
    dispatch(setStep(FORGOT_PASSWORD_STEP_1));
  });

  return (
    <div className={styles["container"]}>
      {/* <span className={styles['welcome-subtext']}>sync your tasks, get daily statistics and more!</span> */}
      <Form
        onSubmit={onSubmit}
        validate={validate}
        initialValues={{
          ...formData,
        }}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit} className={styles["form"]}>
            <div>
              <Field name="email" type="text" placeholder="Enter your email">
                {(props) => (
                  <div>
                    <input
                      className="input"
                      name={props.input.name}
                      value={props.input.value}
                      onChange={props.input.onChange}
                      placeholder="Enter email address"
                    />
                  </div>
                )}
              </Field>
              {/* <Field
                name="password"
                type="password"
                placeholder="Enter your password"
              >
                {(props) => (
                  <div>
                    <input
                      className={styles["email"]}
                      name={props.input.name}
                      value={props.input.value}
                      type="password"
                      onChange={props.input.onChange}
                      placeholder="Enter your password"
                    />
                  </div>
                )}
              </Field> */}
            </div>

            {/* <div>
                    <label>Notes</label>
                    <Field name="notes" component="textarea" placeholder="Notes" />
                </div> */}

            {emailError && <p className={styles["error-text"]}>{emailError}</p>}

            <div className={styles["cta"]}>
              <button
                className="btn btn-login"
                type="submit"
                disabled={submitting || pristine}
                onClick={handleSubmit}
              >
                Continue
              </button>

              <div
                className={styles["forgot-pass"]}
                onClick={(e) => initiatePasswordChange()}
              >
                {" "}
                Forgot password?
              </div>
              {/* <button
                        type="button"
                        onClick={form.reset}
                        disabled={submitting || pristine}
                    >
                        Reset
                    </button> */}
            </div>
            {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
          </form>
        )}
      />
    </div>
  );
}
