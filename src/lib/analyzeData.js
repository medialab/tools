

const parseFilterOptions = (filterExpression) => {
  return filterExpression.split(';').map(option => {
    const values = option.split('|');
    let value = values[0];
    value = value === '0' ? false : value === '1' ? true : value;
    return {
      value,
      label: values[1]
    }
  });
};

export default function analyseData(spreadsheets) {
  const inputObjects = spreadsheets.tools.elements;
  const transforms = spreadsheets.transforms.elements;
  const inputFilters = spreadsheets.filters.elements;

  const filters = inputFilters.map(inputFilter => {
    const optionsEn = parseFilterOptions(inputFilter.options_en);
    const optionsFr = parseFilterOptions(inputFilter.options_fr);
    const filter = {
      optionsEn,
      optionsFr,
      key: inputFilter.key
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
          return obj;
      }
    });
    return newObjects;
  }, inputObjects);
  // normalize data against filters
  const finalObjects = filters.reduce((objects, filter) => {
    return objects.map(obj => {
      // if filter is a boolean normalize to a boolean
      if (filter.optionsEn[0].value === false || filter.optionsEn[0].value === true) {
        return {
          ...obj,
          [filter.key]: obj[filter.key] === '1' ? true: false
        }
      }
      return obj;
    });
  }, filteredObjects);

  return {
    finalObjects,
    filters
  }
}