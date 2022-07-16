import { Add } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AuthService from "../../API/network/AuthService";
import { selectTagsAsArr } from "../../state/selectors";
import {
  openOnboardingModal,
  setLabelModalState,
} from "../../state/slice/GlobalSlice";
import styles from "./TagsSidebar.module.scss";

export function TagsSidebar(props) {
  let tags = useSelector(selectTagsAsArr);

  let pathname = window.location.pathname;
  let selectedTagId = pathname.split("/all/labels/")[1];

  let dispatch = useDispatch();

  const onNewLabelModalOpen = () => {
    if (AuthService.isLoggedIn()) {
      dispatch(setLabelModalState(true));
    } else {
      dispatch(openOnboardingModal());
    }
  };

  const getTags = () => {
    if (tags.length > 0) {
      return (
        <div className={styles["tag-row"]}>
          {tags.map((item) => (
            <Link key={`sidebar-${item.fid}`} to={`/all/labels/${item.fid}`}>
              <div
                className={`${styles["tag"]} ${
                  selectedTagId === item.fid && styles["selected"]
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1 9.58333L8.58333 2H14V7.41667L6.41667 15L1 9.58333ZM11 6C11.5523 6 12 5.55228 12 5C12 4.44772 11.5523 4 11 4C10.4477 4 10 4.44772 10 5C10 5.55228 10.4477 6 11 6Z"
                    fill={item.color}
                  />
                </svg>

                {/* <Label style={{fill: item.color}} /> */}
                {item.title}
              </div>
            </Link>
          ))}
        </div>
      );
    }
    return <div></div>;
  };

  return (
    <div>
      <div className={styles["tags-sidebar"]}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.0666 2.40039H13.76C13.6266 2.40039 13.4932 2.45378 13.3866 2.56036L2.56004 13.3603C2.34669 13.5737 2.34669 13.8936 2.56004 14.107L9.86667 21.4403C9.97325 21.5468 10.1066 21.6002 10.24 21.6002C10.3734 21.6002 10.5067 21.5468 10.6133 21.4403L21.4133 10.6403C21.5198 10.5337 21.5732 10.4004 21.5732 10.267V2.9337C21.6 2.64036 21.36 2.40039 21.0666 2.40039ZM20.5333 10.027L10.2667 20.3203L3.68007 13.7337L13.9734 3.46705H20.5333V10.027ZM18.5867 5.41375C18.1868 5.01383 17.6267 4.80047 17.0666 4.80047C16.5065 4.80047 15.9732 5.01383 15.5465 5.41375C15.1466 5.81368 14.9334 6.37375 14.9334 6.93384C14.9334 7.49393 15.1468 8.02722 15.5467 8.45393C15.9466 8.85385 16.4801 9.06721 17.0668 9.06721C17.6269 9.06721 18.1602 8.85385 18.5869 8.45393C18.9868 8.05401 19.2002 7.5205 19.2002 6.93384C19.2 6.34718 18.9866 5.81371 18.5867 5.41375ZM17.8133 7.6805C17.4134 8.08043 16.6933 8.08043 16.2932 7.6805C16.1066 7.49375 16 7.2272 16 6.93384C16 6.6405 16.1066 6.37375 16.32 6.18718C16.5333 5.97382 16.7999 5.86724 17.0666 5.86724C17.36 5.86724 17.6267 5.97382 17.8133 6.18718C18.0001 6.40054 18.1333 6.66708 18.1333 6.93384C18.1334 7.2004 18.0266 7.49374 17.8133 7.6805Z"
            fill="white"
          />
        </svg>
        Labels
        <span
          onClick={onNewLabelModalOpen}
          className={`${styles["accordion"]}`}
        >
          <Add />
        </span>
      </div>

      <div className={styles["tags-sidebar-second"]}>
        {/* <div className={`${styles["sidebar-row"]}`}>Create a Label</div> */}

        {getTags()}
      </div>
    </div>
  );
}
