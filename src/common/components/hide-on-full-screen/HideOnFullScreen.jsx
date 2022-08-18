import { useSelector } from "react-redux";
import { selectHideElements } from "../../state/selectors";

export function HideOnFullScreen(props) {
  let hideStuff = useSelector(selectHideElements);
  return (
    <div
      style={{
        transition: "opacity 0.4s ease-in-out",
        opacity: !hideStuff ? 1 : 0,
      }}
    >
      {props.children}
    </div>
  );
}
