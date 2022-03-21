import { useDispatch, useSelector } from "react-redux";
import { selectToastObj } from "../../state/selectors";
import { setToast } from "../../state/slice/GlobalSlice";
import { CloseIcon } from "../../svgs/CloseIcon";
import styles from "./Toast.module.scss";

export function Toast(props) {
  let toastObj = useSelector(selectToastObj);
  let dispatch = useDispatch();

  if (!toastObj.open) {
    return <span></span>;
  }

  let closeToast = () => {
    dispatch(
      setToast({
        open: false,
        msg: "",
        duration: 3000,
        type: "success",
      })
    );
  };
  setTimeout(closeToast, toastObj.duration || 3000);
  return (
    <div className={styles["toast"] + " " + styles[toastObj.type]}>
      {toastObj.msg}
      <span className={styles["svg"]} onClick={closeToast}>
        <CloseIcon styles={{ fill: "inherit" }} />
      </span>
    </div>
  );
}
