import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInfo } from "../../state/selectors";
import { updateUserThunk } from "../../state/thunks/UserThunk";
import styles from "./ProfilePicSelector.module.scss";
const totalImages = 9;
export function ProfilePicSelector(props) {
  let [selectedIndex, setSelectedIndex] = useState(0);
  let user = useSelector(selectUserInfo);
  let dispatch = useDispatch();
  useEffect(() => {
    if (user.image) {
      let index = 0;
      if (user.image.startsWith("/dp/")) {
        index = Number(user.image.split("/dp/")[1].split(".png")[0]);
      }
      setSelectedIndex(index - 1);
    }
  }, [user]);

  let onSave = () => {
    let str = "/dp/" + (selectedIndex + 1) + ".png";
    if (str !== user.image) {
      dispatch(updateUserThunk({ image: str }));
    }
    props.onSave && props.onSave();
  };

  return (
    <div>
      <div className={styles["wrapper"]}>
        {[...Array(totalImages)].map((_, index) => {
          return (
            <img
              key={"profile" + index}
              onClick={(e) => setSelectedIndex(index)}
              className={
                styles["image"] +
                " " +
                (index === selectedIndex && styles["selected"])
              }
              src={"/dp/" + (index + 1) + ".png"}
            />
          );
        })}
      </div>
      <button
        onClick={(e) => onSave()}
        className={`btn btn-save ${styles["btn"]}`}
      >
        Save
      </button>
    </div>
  );
}
