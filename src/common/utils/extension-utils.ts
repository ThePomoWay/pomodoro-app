import { store } from "../state/store";
import { updateTimerState } from "../state/thunks/TimerThunk";
import { setExtensionPresent } from "../state/slice/GlobalSlice";

export default function addExtensionListeners() {
  window.addEventListener("message", (event) => {
    if (event.data && event.data.action === "updateTimerStateContentScript") {
      store.dispatch(updateTimerState(event.data.data));
    }

    if (event.data && event.data.action === "extensionPresent") {
      store.dispatch(setExtensionPresent(true));
    }
  });
}
