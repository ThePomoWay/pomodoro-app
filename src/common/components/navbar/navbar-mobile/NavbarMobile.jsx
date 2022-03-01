import { PersonOutlineRounded } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { openOnboardingModal } from "../../../state/slices/GlobalSlice";
import { SunIcon } from "../../../svgs/SunIcon";
import styles from "./NavbarMobile.module.scss";
export default function NavbarMobile(props) {
  let dispatch = useDispatch();
  let triggerOnboardingModal = () => {
    dispatch(openOnboardingModal());
  };
  return (
    <div className={styles["navbar"]}>
      <span className={styles["title"]}>PomöPanda</span>
      <span className={styles["link-item"] + " " + styles["selected"]}>
        <SunIcon /> Today's Tasks
      </span>
      <span
        className={styles["right-container"]}
        onClick={triggerOnboardingModal}
      >
        <PersonOutlineRounded />
      </span>
    </div>
  );
}
