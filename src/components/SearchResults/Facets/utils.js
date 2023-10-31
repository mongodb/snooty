/**
 *
 * @param {obj} facet - contains key and id properties as returned by /v2/status ie.
 * https://docs-search-transport.mongodb.com/v2/status
 *
 * @returns {str} blue | green
 */
export const getFacetTagVariant = (facet) => {
  if (facet.key === 'target_product') {
    return 'green';
  }
  return 'blue';
};
