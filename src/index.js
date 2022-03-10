import React from 'react';
import { hydrate, render } from 'react-dom';
import './index.css';
import App from './App';
import { store } from './common/state/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import addExtensionListeners from './common/utils/extension-utils';
import { ApplyTheme } from './common/components/apply-theme/ApplyTheme';
import { registerWorkerEvent } from './common/utils/worker-util';

const rootElement = document.getElementById("root");

registerWorkerEvent();

// if (rootElement.hasChildNodes()) {
//   hydrate((<React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>), rootElement);
// } else {
  render((
    <Provider store={store}>
      <ApplyTheme>
      <App />
      </ApplyTheme>
    </Provider>
  ), rootElement);
// }

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
if(navigator.userAgent !== 'ReactSnap') {
  serviceWorker.unregister();
}

addExtensionListeners();