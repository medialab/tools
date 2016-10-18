import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';


import configureStore from './redux/configureStore';
import Application from './Application';

const mountNode = document.getElementById('mount');

let CurrentApplication = Application;

const store = configureStore();
window.store = store;

export function renderApplication() {
  const group = (
    <Provider store={store}>
      <CurrentApplication />
    </Provider>
  );
  render(group, mountNode);
}

renderApplication();

/**
 * Hot-reloading.
 */
if (module.hot) {
  module.hot.accept('./Application', function() {
    CurrentApplication = require('./Application').default;
    renderApplication();
  });
}
