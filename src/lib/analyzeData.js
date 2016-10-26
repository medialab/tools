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

  // apply transformations to special fields
  const transformedObjects = transforms.reduce((objects, transform) => {
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

  let invalidFilters = false;

  const requiredFiltersFields = ['key', 'options_mode', 'options_fr', 'options_en', 'title'];

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

    let options;
    let mode;
    if (inputFilter.options_mode === 'fixed') {
      mode = 'fixed';
      const inputOptions = parseFilterOptions(inputFilter.options_en);
      if (inputOptions.indexOf(undefined) > -1) {
        invalidFilters = true;
        return undefined;
      }
      const optionsFr = inputFilter.options_fr.split(';').map(val => val.split('|').pop());
      options = inputOptions.filter(option => option !== undefined).map((inputOption, index) => {
        const option = Object.assign({}, inputOption);
        // fill default with en version
        option.labels.fr = optionsFr.length >= index - 1 ? optionsFr[index] : option.labels.en;
        return option;
      });
    }
    // open options
    else {
      const uniques = transformedObjects.reduce((un, object) => {
        const prop = object[inputFilter.key];
        if (Array.isArray(prop)) {
          prop.forEach(value => {
            if (value) {
              un[value] = un[value] === undefined ? 1 : un[value] + 1;
            }
          });
        }
        // simple value
        else {
          un[prop] = un[prop] === undefined ? 1 : un[prop] + 1;
        }
        return un;
      }, {});
      // populate options with the different possible keys
      options = Object.keys(uniques).map(key => ({
        value: key,
        labels: {
          fr: key,
          en: key
        }
      })).sort((a, b) => {
        if (a.value > b.value) {
          return 1;
        }
        return -1;
      });
      mode = 'open';
    }
    const filter = {
      options,
      title: inputFilter.title,
      mode: mode,
      key: inputFilter.key,
      acceptedValues: []
    };
    return filter;
  });

  if (invalidFilters === true) {
    return undefined;
  }

  // normalize data against filters
  const finalObjects = filters.reduce((objects, filter) => {
    return objects.map(obj => {
      // if filter is a boolean normalize to a boolean
      if (filter.mode === 'fixed' && filter.options[0].value === false || filter.options[0].value === true) {
        return {
          ...obj,
          [filter.key]: obj[filter.key] === '1'
        }
      }
      return obj;
    });
  }, transformedObjects);

  // return processed data
  return {
    allTools: finalObjects,
    filters
  };
};
export const initFilters = (filters, allTools) => {
  return filters.map(filter => {
    // pre-tick only filters which are 'fixed'
    console.log('initing ', filter);
    if (filter.mode === 'fixed') {
      filter.acceptedValues = filter.options.map(option => option.value);
    }

    filter.options = filter.options.map(option => {
      let count = 0;
      allTools.forEach(tool => {
        if (Array.isArray(tool[filter.key]) === false) {
          if (tool[filter.key] === option.value) {
            count++;
          }
        }
        else {
          tool[filter.key].forEach(val => {
            if (val === option.value) {
              count++;
            }
          })
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
    // filter if the filter is closed or (in case of an open-values filters like tags) if at least one value is ticked
    if (thatFilter.options_mode === 'fixed' || thatFilter.acceptedValues.length > 0) {
      return finalData.filter(point => {
        if (Array.isArray(point[thatFilter.key])) {
          // does the point matches all the filters
          let hasAll = true;
          thatFilter.acceptedValues.forEach(val => {
            if(point[thatFilter.key].indexOf(val) === -1) {
              hasAll = false;
            }
          });
          console.log(thatFilter.acceptedValues, point[thatFilter.key], 'hasAll', hasAll);
          return hasAll;
        }
        else {
          return thatFilter.acceptedValues.indexOf(point[thatFilter.key]) > -1;
        }
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


