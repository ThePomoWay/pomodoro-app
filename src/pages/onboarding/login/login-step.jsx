import { useCallback } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import GoogleLogin from "react-google-login";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { LoginForm } from "../../../common/components/login-form/LoginForm";
import { signin } from "../../../common/state/thunks/GlobalThunk";
import { FacebookIcon } from "../../../common/svgs/FacebookIcon";
import { GoogleIcon } from "../../../common/svgs/GoogleIcon";
import styles from "./login-step.module.scss";

export function LoginStep(props) {
  let dispatch = useDispatch();

  const isMobileDevice = useMediaQuery({
    query: "(max-device-width: 1224px)",
  });

  const responseGoogle = useCallback((response) => {
    if (!response.error) {
      dispatch(
        signin({
          mode: "google",
          data: response,
        })
      );
    }
  });

  const componentClicked = useCallback(() => {
    console.log("fb btn clicked");
  });

  const responseFacebook = useCallback((response) => {
    dispatch(
      signin({
        mode: "facebook",
        data: response.accessToken,
      })
    );
  });

  return (
    <div className={styles["container"]}>
      <span
        className={isMobileDevice ? styles["title-mobile"] : styles["title"]}
      >
        Welcome to&nbsp;<span className={styles["logo"]}>Time</span>Dojo
      </span>

      <div
        className={
          isMobileDevice ? styles["socials-mobile"] : styles["socials"]
        }
      >
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
              <span>Continue with Google</span>
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
                <span>Continue with Facebook</span>
              </button>
            )}
          />
        </div>
      </div>

      <div className={styles["divider"]}>
        <span className={styles["divider-text"]}>or</span>
      </div>

      {<LoginForm />}

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
