import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsTimerFullScreen } from "../../state/selectors";
import { setHideElements } from "../../state/slice/MusicSlice";

let timeout = false;

export function useHideOnFullScreen() {
  let isFullScreen = useSelector(selectIsTimerFullScreen);

  let fullScreenRef = useRef();
  fullScreenRef.current = isFullScreen;

  let dispatch = useDispatch();

  let mouseMove = () => {
    if (fullScreenRef.current) {
      dispatch(setHideElements(false));
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        if (fullScreenRef.current) {
          dispatch(setHideElements(true));
        }
      }, 3500);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", mouseMove);
  }, []);
  return;
}
