import { BarChartOutlined, HomeOutlined, SettingsOutlined } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import AuthService from "../API/network/AuthService";
import { openOnboardingModal } from "../state/slice/GlobalSlice";
import styles from "./MobileNavbar.module.scss";

export function MobileNavbar() {
  let location = useLocation();
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let navigateTo = (link) => {
    if (location.pathname === "/" && link === "/") {
      window.scroll(0, 0);
    }

    if (link === "/analysis" && !AuthService.isLoggedIn()) {
      dispatch(openOnboardingModal());
    } else {
      navigate(link);
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
          location.pathname === "/settings" && styles["selected"]
        }`}
        onClick={() => navigateTo("/settings")}
      >
        <SettingsOutlined />
      </div>
      <div
        className={`${styles["item"]} ${
          location.pathname === "/analysis" && styles["selected"]
        }`}
        onClick={() => navigateTo("/analysis")}
      >
        <BarChartOutlined />
      </div>
    </div>
  );
}
