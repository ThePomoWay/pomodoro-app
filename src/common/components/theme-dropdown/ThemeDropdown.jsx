import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePaymentStatus } from "../../hooks/PaymentHook";
import { selectTheme } from "../../state/selectors";
import { setPricingModalState, setTheme } from "../../state/slice/GlobalSlice";
import { THEME_DARK, THEME_LIGHT } from "../../utils/constants";
import { CustomSlider } from "../custom-slider/CustomSlider";
import styles from "./ThemeDropdown.module.scss";

export function ThemeDropdown({}) {
  let [themeAnchorEl, setThemeAnchorEl] = useState(false);

  let { isSubscriptionActive } = usePaymentStatus();
  let theme = useSelector(selectTheme);

  const onClose = useCallback(() => {
    setThemeAnchorEl(null);
  });

  let dispatch = useDispatch();

  let switchTheme = (dark) => {
    if (isSubscriptionActive) {
      dispatch(setTheme(dark ? THEME_DARK : THEME_LIGHT));
    } else {
      dispatch(setPricingModalState(true));
    }
  };

  // return (
  //   <div className={styles["profile"]}>
  //     <ClickAwayListener onClickAway={onClose}>
  //       <div>
  //         <div
  //           className="flex flex-center"
  //           onClick={(e) => setThemeAnchorEl(e.currentTarget)}
  //         >
  //           <p>Theme</p>
  //           <span className={`${styles["arrow"]}`}>
  //             <ArrowDropDown />
  //           </span>
  //         </div>

  //         <Popper
  //           open={Boolean(themeAnchorEl)}
  //           id="project-popover"
  //           anchorEl={themeAnchorEl}
  //           onClose={onClose}
  //           position="bottom-left"
  //         >
  //           <div
  //             className="popper-container"
  //             onClick={(e) => e.stopPropagation()}
  //           >
  //             <div
  //               className="popper-item"
  //               onClick={(e) => switchTheme(THEME_LIGHT)}
  //             >
  //               Light Theme
  //             </div>
  //             <div
  //               className="popper-item"
  //               onClick={(e) => switchTheme(THEME_DARK)}
  //             >
  //               Dark Theme
  //             </div>
  //           </div>
  //         </Popper>
  //       </div>
  //     </ClickAwayListener>
  //   </div>
  // );

  return (
    <div className={styles["theme"]}>
      {/* <div
        className={styles["option"]}
        onClick={(e) => switchTheme(THEME_LIGHT)}
      >
        <Radio
          checked={theme === THEME_LIGHT}
          value="Light Theme"
          name="radio-buttons"
          inputProps={{ "aria-label": "Light Theme" }}
        />
        <p>Light Theme</p>
      </div> */}

      {/* <button
        className={`btn ${theme === THEME_LIGHT ? "btn-save" : "btn-theme"}`}
        onClick={(e) => switchTheme(THEME_LIGHT)}
      >
        Light Theme
      </button> */}

      {/* <div
        className={styles["option"]}
        onClick={(e) => switchTheme(THEME_DARK)}
      >
        <Radio
          checked={theme === THEME_DARK}
          value="Dark Theme"
          name="radio-buttons"
          inputProps={{ "aria-label": "Dark Theme" }}
        />
        <p>Dark Theme</p>
      </div> */}

      {/* <button
        className={`btn ${theme === THEME_DARK ? "btn-save" : "btn-theme"}`}
        onClick={(e) => switchTheme(THEME_DARK)}
      >
        Dark Theme
      </button> */}

      <CustomSlider value={theme === THEME_DARK} onChange={switchTheme} />
    </div>
  );
}
