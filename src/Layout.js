import React from 'react';

import CardsList from './components/CardsList';
import FilterGroup from './components/FilterGroup';

import './Layout.scss';

const Layout = ({
  filteredTools = [],
  allTools = [],
  filters = [],
  isDataLoaded = false,
  freeTextFilter = '',
  actions: {
    setCategoryFilter,
    setFreeTextFilter
  }
}) => (
  <div id="layout-wrapper">
    <aside id="aside-container">
      <img src="http://www.medialab.sciences-po.fr/wp-content/uploads/2016/04/logo.png" />
      <h2>Tools we develop, and tools we use</h2>

      <input type="text" placeholder="Search a project" value={freeTextFilter} onChange={(evt) => setFreeTextFilter(evt.target.value)}/>

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
