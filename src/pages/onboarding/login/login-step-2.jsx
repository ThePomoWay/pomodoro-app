import styles from "../signup/signup.module.scss";

import { Field, Form } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLoginName,
  selectLoginPasswordError,
  selectRegisterEmail,
} from "../../../common/state/selectors";
import {
  setLoginPasswordError,
  setStep,
} from "../../../common/state/slice/OnboardingSlice";
import { login } from "../../../common/state/thunks/OnboardingThunk";
import { ChevronLeft } from "../../../common/svgs/ChevronLeft";
import { LOGIN_REGISTER_STEP } from "../../../common/utils/constants";

export function LoginStep2(props) {
  let name = useSelector(selectLoginName);
  let email = useSelector(selectRegisterEmail);
  let passwordError = useSelector(selectLoginPasswordError);

  let dispatch = useDispatch();

  let goBack = () => {
    dispatch(setStep(LOGIN_REGISTER_STEP));
  };

  let validate = (vals) => {
    return vals.password && vals.password.length < 4;
  };
  let onSubmit = (vals) => {
    if (vals.password && vals.password.length >= 4) {
      dispatch(
        login({
          email,
          password: vals.password,
        })
      );
    } else {
      dispatch(setLoginPasswordError("Password and Email don't match"));
    }
  };

  return (
    <div className={styles["container"]}>
      <span className={styles["welcome-text"]}>
        <ChevronLeft onClick={goBack} style={{ cursor: "pointer" }} />
        <span>Welcome back {name}</span>
      </span>
      <Form
        onSubmit={onSubmit}
        validate={validate}
        initialValues={{
          password: "",
        }}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit} className={styles["form"]}>
            <div>
              <Field
                name="password"
                type="password"
                placeholder="Enter your Password"
              >
                {({ input, meta }) => (
                  <input
                    name={input.name}
                    value={input.value}
                    onChange={input.onChange}
                    placeholder="Enter your password"
                    label="Password"
                    type="password"
                    className="input"
                  />
                )}
              </Field>
            </div>
            {passwordError && (
              <p className={styles["error-text"]}>{passwordError}</p>
            )}
            <div className={styles["cta"]}>
              <button
                className="btn btn-login"
                type="submit"
                disabled={submitting || pristine}
                onClick={handleSubmit}
              >
                Login
              </button>
            </div>
          </form>
        )}
      ></Form>
    </div>
  );
}
