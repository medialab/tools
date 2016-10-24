import React from 'react';

const FilterGroup = ({
  filter,
  setCategoryFilter
}) => {
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

  return (<div className="category-filter-container">
    <form style={{marginTop: '1rem'}} className="filterGroup">
      {filter.options.map((option, key) => (
        <div key={key}> 
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
  </div>);
};

export default FilterGroup;