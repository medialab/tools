import React from 'react';
import {render} from 'react-dom';

import Application from './Application';

const mountNode = document.getElementById('mount');

let CurrentApplication = Application;

export function renderApplication() {
  const group = (
    <CurrentApplication />
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
