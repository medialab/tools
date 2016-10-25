import fuzzy from 'fuzzy';

const parseFilterOptions = (filterExpression) => {
  return filterExpression.split(';').map(option => {
    const values = option.split('|');
    let value = values[0];
    value = value === '1' ? false : value === '0' ? true : value;
    return {
      value,
      labels: {
        en: values[1]
      }
    }
  });
};

export default function analyseData(spreadsheets) {
  const inputObjects = spreadsheets.tools.elements;
  const transforms = spreadsheets.transforms.elements;
  const inputFilters = spreadsheets.filters.elements;

  const filters = inputFilters.map(inputFilter => {
    const inputOptions = parseFilterOptions(inputFilter.options_en);
    const optionsFr = inputFilter.options_fr.split(';').map(val => val.split('|').pop());
    const options = inputOptions.map((inputOption, index) => {
      const option = Object.assign({}, inputOption);
      option.labels.fr = optionsFr[index];
      return option;
    });
    const filter = {
      options,
      key: inputFilter.key,
      acceptedValues: []
    };
    return filter;
  });

  // apply transformations to special fields
  const filteredObjects = transforms.reduce((objects, transform) => {
    return objects.map(obj => {
      switch (transform.type) {
        case 'list':
          return {
            ...obj,
            [transform.key]: obj[transform.key].split(transform.separator).map(val => val.trim())
          };
          return obj2;

        case 'highlight':
          const highlighted = obj[transform.key] === '1';
          return {
              ...obj,
              highlighted
            };
        default:
          return obj === '' ? undefined: obj;
      }
    });
    return newObjects;
  }, inputObjects);
  // normalize data against filters
  const finalObjects = filters.reduce((objects, filter) => {
    return objects.map(obj => {
      // if filter is a boolean normalize to a boolean
      if (filter.options[0].value === false || filter.options[0].value === true) {
        return {
          ...obj,
          [filter.key]: obj[filter.key] === '1'
        }
      }
      return obj;
    });
  }, filteredObjects);
  return {
    allTools: finalObjects,
    filters
  }
}

export const initFilters = (filters, allTools) => {
  return filters.map(filter => {
    filter.acceptedValues = allTools.reduce((values, obj) => {
      if (values.indexOf(obj[filter.key]) === -1) {
        return [...values, obj[filter.key]];
      }
      return values;
    }, []);

    filter.options = filter.options.map(option => {
      let count = 0;
      allTools.forEach(tool => {
        if (tool[filter.key] === option.value) {
          count++;
        }
      });
      return {
        ...option,
        count
      }
    })
    return filter;
  });
};

export const consumeFilters = (allTools, activeFilters) => {
  return activeFilters.reduce((finalData, thatFilter) => {
    if (thatFilter.acceptedValues) {
      return finalData.filter(point => {
        return thatFilter.acceptedValues.indexOf(point[thatFilter.key]) > -1;
      });
    }
    return finalData;
  }, allTools);
};

const fuzzyOptions = { 
  pre: '<', 
  post: '>',
  extract: el => Object.keys(el).reduce((str, key) => str + el[key], '')
}

export const consumeFreeTextFilter = (allTools, searchStr) => {
  const filtered = fuzzy.filter(searchStr, allTools,  fuzzyOptions);
  return filtered
          .filter(tool => tool.score > 5)
          .sort((a, b) =>{
            if (a.score < b.score) {
              return 1;
            }
            return -1;
          } )
          .map(tool => tool.original);
}


