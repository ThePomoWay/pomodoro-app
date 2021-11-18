import React from 'react';
import { hydrate, render } from 'react-dom';
import './index.css';
import App from './App';
import { store } from './common/state/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

const rootElement = document.getElementById("root");


// if (rootElement.hasChildNodes()) {
//   hydrate((<React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>), rootElement);
// } else {
  render((
    <Provider store={store}>
      <App />
    </Provider>
  ), rootElement);
// }

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
