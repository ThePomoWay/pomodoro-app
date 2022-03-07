import { AccessTime, MusicNote, Person } from "@material-ui/icons";
import styles from "./SettingsSideNav.module.scss";
import { Link, useRouteMatch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSettingsTab } from "../../state/slice/GlobalSlice";

const tabs = [
  {
    icon: <Person />,
    title: "Profile",
    link: "/settings",
  },
  {
    icon: <AccessTime />,
    title: "Clock",
    link: "/settings/sound",
  },

  {
    icon: <MusicNote />,
    title: "Sound",
    link: "/settings/sound",
  },
];

export function SettingsSideNav(props) {
  let path = window.location.pathname;
  let dispatch = useDispatch();
  let changeTab = (index) => {
    dispatch(setSettingsTab(index));
  };
  return (
    <div className={styles["sidenav"]}>
      <div className={`font-sub-heading ${styles["settings-title"]}`}>
        Settings
      </div>
      {tabs.map((item, index) => (
        <div onClick={() => changeTab(index)} key={"settingsSideNav#" + index}>
          <div
            className={`${styles["sidenav-item"]} ${
              path === item.link && styles["selected"]
            }`}
          >
            <div className={styles["svg"]}>{item.icon}</div>
            <div className={styles["title"]}>{item.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
