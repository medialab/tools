import React from 'react';

import CardsList from './components/CardsList';

import './Layout.scss';

const Layout = ({
  saidCoucou,
  allTools,
  actions: {
    sayCoucou
  }
}) => (
  <div>
    <CardsList cards={allTools} />
  </div>
)

export default Layout;