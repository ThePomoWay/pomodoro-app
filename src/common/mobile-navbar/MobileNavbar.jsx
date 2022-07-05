import { BarChartOutlined, HomeOutlined } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import AuthService from "../API/network/AuthService";
import { openOnboardingModal } from "../state/slice/GlobalSlice";
import { ReactComponent as SettingsIcon } from "../svgs/SettingsIcon.svg";
import styles from "./MobileNavbar.module.scss";

export function MobileNavbar() {
  let location = useLocation();
  let history = useHistory();
  let dispatch = useDispatch();
  let navigateTo = (link) => {
    if (link === "/analysis" && !AuthService.isLoggedIn()) {
      dispatch(openOnboardingModal());
    } else {
      history.push(link);
    }
  };
  return (
    <div className={styles["nav"]}>
      <div
        className={`${styles["item"]} ${
          location.pathname === "/" && styles["selected"]
        }`}
        onClick={() => navigateTo("/")}
      >
        <HomeOutlined />
      </div>

      <div
        className={`${styles["item"]} ${
          location.pathname === "/analysis" && styles["selected"]
        }`}
        onClick={() => navigateTo("/analysis")}
      >
        <BarChartOutlined />
      </div>

      <div
        className={`${styles["item"]} ${
          location.pathname === "/settings" && styles["selected"]
        }`}
        onClick={() => navigateTo("/settings")}
      >
        <SettingsIcon />
      </div>
    </div>
  );
}
