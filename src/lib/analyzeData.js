import fuzzy from 'fuzzy';

const parseFilterOptions = (filterExpression) => {
  return filterExpression.split(';').map(option => {
    const values = option.split('|');
    if (values.length < 2) {
      console.error('you must separate filtered values with their label with a "|". Not done for %s', JSON.stringify(option, null, 2));
      return undefined;
    }
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

export default function analyzeData(spreadsheets = {}) {
  const requiredTabs = ['tools', 'transforms', 'filters'];
  const invalidTabs = requiredTabs.some(tabName => {
    if (spreadsheets[tabName] === undefined) {
      console.error('you must provide a tab named "%s" to the google spreadsheet', tabName);
      return true;
    }
  });
  if (invalidTabs) {
    return undefined;
  }
  const inputObjects = spreadsheets.tools.elements;
  const transforms = spreadsheets.transforms.elements;
  const inputFilters = spreadsheets.filters.elements;

  let invalidFilters = false;

  const requiredFiltersFields = ['key', 'options_fr', 'options_en'];

  const filters = inputFilters.map(inputFilter => {
    // check fields
    const missesFields = requiredFiltersFields.find(field => {
      if (inputFilter[field] === undefined) {
        console.error('you must provide a "%s" column to the filters tab of your data spreadsheet', field);
        invalidFilters = true;
        return true;
      }
    });
    if (missesFields) {
      invalidFilters = true;
      return undefined;
    }
    // check key is not empty
    if (inputFilter.key.trim().length === 0) {
      console.error('"key" column must be filled in your data spreadsheet');
      invalidFilters = true;
      return undefined;
    }
    const inputOptions = parseFilterOptions(inputFilter.options_en);
    if (inputOptions.indexOf(undefined) > -1) {
      invalidFilters = true;
      return undefined;
    }
    const optionsFr = inputFilter.options_fr.split(';').map(val => val.split('|').pop());
    const options = inputOptions.filter(option => option !== undefined).map((inputOption, index) => {
      const option = Object.assign({}, inputOption);
      // fill default with en version
      option.labels.fr = optionsFr.length >= index - 1 ? optionsFr[index] : option.labels.en;
      return option;
    });
    const filter = {
      options,
      key: inputFilter.key,
      acceptedValues: []
    };
    return filter;
  });

  if (invalidFilters === true) {
    return undefined;
  }

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
  };
};

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
};

export const consumeFreeTextFilter = (allTools, searchStr) => {
  const filtered = fuzzy.filter(searchStr, allTools,  fuzzyOptions);
  return filtered
          .filter(tool => tool.score > 15)
          .sort((a, b) => {
            if (a.score < b.score) {
              return 1;
            }
            return -1;
          })
          .map(tool => tool.original);
};


