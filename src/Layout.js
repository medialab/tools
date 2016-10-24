import React from 'react';

import CardsList from './components/CardsList';

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
      {filters.map((filter, key) => {

        const isAccepted = (value) => {
          return filter.acceptedValues ?
          filter.acceptedValues.indexOf(value) > -1
          : true;
        };
        const toggleValue = (value, e) => {
          const existingAccepted = filter.acceptedValues || [];
          const exists = existingAccepted.indexOf(value) > -1;
          const newAccepted = exists ? existingAccepted.filter(val => val !== value)
          : [...existingAccepted, value];
          setCategoryFilter({
            ...filter,
            acceptedValues: newAccepted
          });
        };
        return (<div className="category-filter-container" key={key}>
          <form style={{marginTop: '1rem'}} className="filterGroup">
            {filter.options.map((option, key2) => (
              <div 
                key={key2}> 
                <input 
                  onClick={(e) => toggleValue(option.value, e)} 
                  defaultChecked={isAccepted(option.value)} 
                  type="checkbox" 
                  value={option.value} 
                  name={option.value}/>
                <label 
                  htmlFor={option.value}>
                  {option.labels.en} ({option.count})
                </label>
              </div>
            ))}
          </form>
        </div>) 
      })}
    </aside>
    <section id="main-container">
      <CardsList loading={!isDataLoaded} cards={filteredTools} />
    </section>
  </div>
);

export default Layout;