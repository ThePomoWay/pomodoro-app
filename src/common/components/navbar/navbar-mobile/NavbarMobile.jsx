import { PersonOutlineRounded } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme } from "../../../state/selectors";
import { openOnboardingModal } from "../../../state/slice/GlobalSlice";

import { THEME_DARK } from "../../../utils/constants";
import styles from "./NavbarMobile.module.scss";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../API/network/AuthService";
import { ProfileDropdown } from "../../profile-dropdown/ProfileDropdown";

export default function NavbarMobile(props) {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let theme = useSelector(selectTheme);
  let triggerOnboardingModal = () => {
    dispatch(openOnboardingModal());
  };

  let navigateToHome = () => {
    navigate("/");
  };
  return (
    <div className={styles["navbar"]}>
      <span className={styles["app"]} onClick={navigateToHome}>
        <img
          width={"100%"}
          height={"100%"}
          src={
            theme === THEME_DARK
              ? "/logo/logo-dark.svg"
              : "/logo/logo-title.svg"
          }
          alt="Logo"
        />
      </span>

      {!AuthService.isLoggedIn() && (
        <span
          className={styles["right-container"]}
          onClick={triggerOnboardingModal}
        >
          <PersonOutlineRounded />
        </span>
      )}

      {AuthService.isLoggedIn() && (
        <span className={styles["right-container"]}>
          <ProfileDropdown />
        </span>
      )}
    </div>
  );
}
