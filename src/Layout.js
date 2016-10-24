import React from 'react';

import CardsList from './components/CardsList';
import FilterGroup from './components/FilterGroup';

import './Layout.scss';

const Layout = ({
  filteredTools = [],
  allTools = [],
  filters = [],
  isDataLoaded = false,
  actions: {
    setCategoryFilter
  }
}) => (
  <div id="layout-wrapper">
    <aside id="aside-container">
      <h2>Medialab tools</h2>

      <p>{filteredTools.length} / {allTools.length}</p>
      {filters.map((filter, key) => (
          <FilterGroup setCategoryFilter={setCategoryFilter} filter={filter} key={key} />
        )
      )}
    </aside>
    <section id="main-container">
      <CardsList loading={!isDataLoaded} cards={filteredTools} />
    </section>
  </div>
);

export default Layout;