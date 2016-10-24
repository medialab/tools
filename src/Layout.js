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
  <div id="layout-wrapper">
    <aside id="aside-container">
      <h2>Medialab tools</h2>
    </aside>
    <section id="main-container">
      <CardsList cards={allTools} />
    </section>
  </div>
)

export default Layout;