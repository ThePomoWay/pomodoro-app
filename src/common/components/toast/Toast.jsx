import { useSelector } from "react-redux";
import { selectToastObj } from "../../state/selectors";
import { CloseIcon } from "../../svgs/CloseIcon";
import styles from "./Toast.module.scss";

export function Toast(props) {
  let toastObj = useSelector(selectToastObj);

  if (!toastObj.open) {
    return <span></span>;
  }
  return (
    <div className={styles["toast"] + " " + styles[toastObj.type]}>
      {toastObj.msg}
      <span className={styles["svg"]}>
        <CloseIcon styles={{ fill: "inherit" }} />
      </span>
    </div>
  );
}
