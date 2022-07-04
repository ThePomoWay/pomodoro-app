import { HomeOutlined, ReportOutlined } from "@material-ui/icons";
import styles from "./MobileNavbar.module.scss";
import { ReactComponent as SettingsIcon } from "../svgs/SettingsIcon.svg";
import { useLocation, useHistory } from "react-router-dom";

export function MobileNavbar() {
  let location = useLocation();
  let history = useHistory();
  let navigateTo = (link) => {
    history.push(link);
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
        <ReportOutlined />
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
