import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { store } from "./common/state/store";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import addExtensionListeners, {
  addSWListeners,
} from "./common/utils/extension-utils";
import { ApplyTheme } from "./common/components/apply-theme/ApplyTheme";
import { registerWorkerEvent } from "./common/utils/worker-util";
import { initializeTabsCommunication } from "./common/utils/close-background-tabs";

const rootElement = document.getElementById("root");

registerWorkerEvent();

const root = createRoot(rootElement);

// if (rootElement.hasChildNodes()) {
//   hydrate((<React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>), rootElement);
// } else {
root.render(
  <Provider store={store}>
    <ApplyTheme>
      <App />
    </ApplyTheme>
  </Provider>
);
// }

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
if (navigator.userAgent !== "ReactSnap") {
  serviceWorker.register();
  initializeTabsCommunication();

  // setTimeout(serviceWorker.showNotification, 3000);
}

addExtensionListeners();
addSWListeners();
