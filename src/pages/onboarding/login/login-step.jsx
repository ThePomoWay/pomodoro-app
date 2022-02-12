import { useCallback, useState } from "react";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { useDispatch } from "react-redux";
import { LoginForm } from "../../../common/components/login-form/LoginForm";
import styles from "./login-step.module.scss";
import { signin } from "../../../common/state/slices/GlobalSlice";

import { SignupStep1 } from "../signup/signup-step-1";
import { GoogleIcon } from "../../../common/svgs/GoogleIcon";
import { FacebookIcon } from "../../../common/svgs/FacebookIcon";

export function LoginStep(props) {
  let dispatch = useDispatch();

  let [isLogin, setIsLogin] = useState(true);

  const responseGoogle = useCallback((response) => {
    console.log(response);
    dispatch(
      signin({
        mode: "google",
        data: response,
      })
    );
  });

  const componentClicked = useCallback(() => {
    console.log("fb btn clicked");
  });

  const responseFacebook = useCallback((response) => {
    console.log(response);
    dispatch(
      signin({
        mode: "facebook",
        data: response.tokenObj.access_token,
      })
    );
  });

  return (
    <div className={styles["container"]}>
      <span className={styles["title"]}>
        Welcome to&nbsp;<span className={styles["logo"]}>Pomö</span>Panda
      </span>

      <div className={styles["socials"]}>
        <GoogleLogin
          clientId="905357367821-f8j4n23ghi3bbebga32e105e375edfj2.apps.googleusercontent.com"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={"single_host_origin"}
          icon={true}
          render={(renderProps) => (
            <button
              className={"btn btn-google"}
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <GoogleIcon />
              <span>Sign Up with Google</span>
            </button>
          )}
        />

        <div className={styles["facebook"]}>
          <FacebookLogin
            appId="958233501449664"
            autoLoad={false}
            onClick={componentClicked}
            callback={responseFacebook}
            render={(renderProps) => (
              <button
                className="btn btn-facebook"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                <FacebookIcon />
                <span>Sign Up with Facebook</span>
              </button>
            )}
          />
        </div>
      </div>

      <div className={styles["divider"]}>
        <span className={styles["divider-text"]}>or</span>
      </div>

      {(isLogin && <LoginForm />) || (
        <SignupStep1 onChange={() => setIsLogin(true)} />
      )}

      {/* {isLogin && (
        <div
          className={styles["signup-text"]}
          onClick={(e) => setIsLogin(false)}
        >
          Don't have an account? Sign Up
        </div>
      )} */}
    </div>
  );
}
