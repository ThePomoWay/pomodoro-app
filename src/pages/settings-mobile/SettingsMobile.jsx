import { ClockSettings } from "../../common/components/clock-setting/ClockSettings";
import Navbar from "../../common/components/navbar/Navbar";
import styles from "./SettingsMobile.module.scss";
export function SettingsMobile() {
  return (
    <>
      <Navbar />
      <div className={styles["container"]}>
        <ClockSettings hideSidebar={true} />
      </div>
    </>
  );
}
