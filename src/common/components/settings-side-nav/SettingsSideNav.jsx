import { AccessTime, MusicNote, Person } from "@material-ui/icons";
import styles from "./SettingsSideNav.module.scss";
import { Link, useRouteMatch } from "react-router-dom";

const tabs = [
  {
    icon: <Person />,
    title: "Profile",
    link: "/settings",
  },
  {
    icon: <AccessTime />,
    title: "Timer",
    link: "/settings/timer",
  },
  {
    icon: <MusicNote />,
    title: "Sound",
    link: "/settings/sound",
  },
];

export function SettingsSideNav(props) {
  let path = window.location.pathname;
  return (
    <div className={styles["sidenav"]}>
      {tabs.map((item, index) => (
        <Link to={item.link} key={"settingsSideNav#" + index}>
          <div
            className={`${styles["sidenav-item"]} ${
              path === item.link && styles["selected"]
            }`}
          >
            <div className={styles["svg"]}>{item.icon}</div>
            <div className={styles["title"]}>{item.title}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
