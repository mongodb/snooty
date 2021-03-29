const { getNestedValue } = require('./get-nested-value');
const { findKeyValuePair } = require('./find-key-value-pair');

// Get various metadata for a given page
const getGuideMetadata = (pageNode) => {
  const children = getNestedValue(['ast', 'children'], pageNode);
  return {
    title: getNestedValue([0, 'children', 0, 'children', 0, 'value'], children),
    category: getNestedValue(['argument', 0, 'value'], findKeyValuePair(children, 'name', 'category')),
    completionTime: getNestedValue(['argument', 0, 'value'], findKeyValuePair(children, 'name', 'time')),
    languages: findKeyValuePair(children, 'name', 'languages'),
  };
};

module.exports.getGuideMetadata = getGuideMetadata;
