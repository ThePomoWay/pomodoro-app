import styles from "./navbarDesktop.module.scss";
import { Link } from "react-router-dom";
import AuthService from "../../../API/network/AuthService";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openOnboardingModal } from "../../../state/slices/GlobalSlice";
import { selectUserInfo } from "../../../state/selectors";
import { ProfileDropdown } from "../../profile-dropdown/ProfileDropdown";
import { SunIcon } from "../../../svgs/SunIcon";

let navItems = [
  {
    icon: <SunIcon />,
    title: "Today's Tasks",
    to: "/",
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
        <rect
          x="2.16666"
          y="2.16797"
          width="15.6667"
          height="5.66667"
          rx="1.16667"
          stroke="currentColor"
        />
        <rect
          x="2.16666"
          y="12.168"
          width="15.6667"
          height="5.66667"
          rx="1.16667"
          stroke="currentColor"
        />
      </svg>
    ),
    title: "All Tasks",
    to: "/all",
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
        <g clipPath="url(#clip0_355_741)">
          <path
            d="M5.95979 10.2203L6.16812 9.8595L5.84619 9.67364L5.62495 9.97236L5.95979 10.2203ZM11.7415 13.5584L11.5332 13.9193L11.867 14.112L12.0851 13.7942L11.7415 13.5584ZM18.1024 4.80962C18.0603 4.58338 17.8428 4.43411 17.6165 4.47621L13.9298 5.16226C13.7036 5.20436 13.5543 5.42189 13.5964 5.64813C13.6385 5.87436 13.8561 6.02363 14.0823 5.98153L17.3594 5.37171L17.9692 8.64878C18.0113 8.87502 18.2288 9.02429 18.455 8.98219C18.6813 8.94009 18.8306 8.72256 18.7885 8.49633L18.1024 4.80962ZM1.75862 16.593L6.29462 10.4683L5.62495 9.97236L1.08895 16.097L1.75862 16.593ZM5.75145 10.5812L11.5332 13.9193L11.9498 13.1976L6.16812 9.8595L5.75145 10.5812ZM12.0851 13.7942L18.0363 5.1216L17.3492 4.65009L11.398 13.3227L12.0851 13.7942Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id="clip0_355_741">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    title: "Insights",
    to: "/analysis",
  },
];
export default function NavbarDesktop(props) {
  let isLoggedIn = AuthService.isLoggedIn();
  let dispatch = useDispatch();

  let userInfo = useSelector(selectUserInfo);

  let onOpenOnboardingModal = useCallback(() => {
    dispatch(openOnboardingModal());
  }, []);
  <></>;

  return (
    <div className={styles["navbar"]}>
      <div className={styles["navbar-content"]}>
        <span className={styles["app"]}>
          <span className={styles["title"]}>PomöPanda</span>
        </span>

        <div className={styles["links"]}>
          <div className={styles["link-items"]}>
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className={`${styles["link-item"]} ${
                  styles["link-item-" + (index + 1)]
                } ${
                  String(index) === props.selected ? styles["selected"] : ""
                }`}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
            {/* <span className={styles["link-item"]}><Menu /></span> */}
          </div>
        </div>

        <div className={styles["right-nav"]}>
          {/* <div>
                        <span className={styles['manage-focus']}>Manage Focus</span>
                    </div>
                    <div>
                        <button className='btn btn-premium'>Premium</button>
                    </div> */}

          {(isLoggedIn && <ProfileDropdown />) || (
            <div
              className={styles["login"]}
              onClick={(e) => onOpenOnboardingModal()}
            >
              Login
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
