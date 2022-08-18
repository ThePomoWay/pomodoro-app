import { MusicNote, Person } from "@material-ui/icons";
import styles from "./SettingsSideNav.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setSettingsTab } from "../../state/slice/GlobalSlice";
import { selectSettingsTab } from "../../state/selectors";
import { ReactComponent as PaymentIcon } from "../../svgs/SettingsPricing.svg";

const tabs = [
  {
    icon: <Person style={{ width: "20px", height: "20px" }} />,
    title: "Profile",
    link: "/settings",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="10"
          cy="10.0013"
          r="7.91667"
          stroke="inherit"
          strokeWidth="0.833333"
        />
        <path
          d="M17.0833 10.4167C17.0833 10.6634 16.9564 10.9438 16.6286 11.2452C16.3004 11.547 15.8026 11.8378 15.1523 12.0907C13.8543 12.5955 12.0328 12.9167 10 12.9167C7.96716 12.9167 6.1457 12.5955 4.84772 12.0907C4.1974 11.8378 3.69956 11.547 3.3714 11.2452C3.0436 10.9438 2.91667 10.6634 2.91667 10.4167C2.91667 10.1699 3.0436 9.88948 3.3714 9.58809C3.69956 9.28637 4.1974 8.99551 4.84772 8.74261C6.1457 8.23784 7.96716 7.91667 10 7.91667C12.0328 7.91667 13.8543 8.23784 15.1523 8.74261C15.8026 8.99551 16.3004 9.28637 16.6286 9.58809C16.9564 9.88948 17.0833 10.1699 17.0833 10.4167Z"
          stroke="inherit"
          strokeWidth="0.833333"
        />
      </svg>
    ),
    title: "Clock",
    link: "/settings/sound",
  },
  {
    icon: <PaymentIcon />,
    title: "Payments",
    link: "/settings/payments",
  },

  {
    icon: <MusicNote />,
    title: "Sound",
    link: "/settings/sound",
  },
];

export function SettingsSideNav(props) {
  let dispatch = useDispatch();
  let tab = useSelector(selectSettingsTab);
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
              index === tab && styles["selected"]
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
