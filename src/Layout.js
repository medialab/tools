import React from 'react';

import CardsList from './components/CardsList';
import FilterGroup from './components/FilterGroup';

import './Layout.scss';

const Layout = ({
  filteredTools = [],
  allTools = [],
  filters = [],
  groups=[],
  isDataLoaded = false,
  freeTextFilter = '',
  actions: {
    setCategoryFilter,
    setFreeTextFilter
  }
}) => (
  <div id="layout-wrapper">
    <aside id="aside-container">
      <img className="logo" src="assets/images/logo_medialab.svg" />
      <input type="text" placeholder="Search a project" value={freeTextFilter} onChange={(evt) => setFreeTextFilter(evt.target.value)}/>
      <p>{filteredTools.length} / {allTools.length}</p>
      {filters.map((filter, key) => (
          <FilterGroup setCategoryFilter={setCategoryFilter} filter={filter} key={key} />
        )
      )}
    </aside>
    <section id="main-container">
      {groups.map((group, key) => (
        <section className="cards-group" key={key}>
          <h2>{group.labels.en}</h2>
          <CardsList loading={!isDataLoaded} cards={filteredTools.filter(item => item.group === group.value)} />
        </section>
      ))
      }
    </section>
  </div>
);

export default Layout;
