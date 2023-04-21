// Helper function which extracts a marian title based on the format
// title — property. Also optionally only parse the first 9 results for the dropdown
const setAliasesKey = {
  'manual-upcoming': 'manual-v6.3',
  'manual-manual': 'manual-v6.2',
};

export const getSearchbarResultsFromJSON = (resultJSON, searchPropertyMapping = {}, limitResults) => {
  const resultsWithoutProperty = resultJSON.results
    .filter((r) => {
      const searchProperty = r.searchProperty?.[0];
      const endsWithDash = searchProperty?.endsWith('-');
      const key = setAliasesKey[searchProperty] ? setAliasesKey[searchProperty] : searchProperty;
      const isInMapping = !!searchPropertyMapping[key];
      return !endsWithDash && isInMapping;
    })
    .map((r) => ({ ...r, title: r.title.split(' —')[0] }));
  if (limitResults) {
    return resultsWithoutProperty.slice(0, limitResults);
  }
  return resultsWithoutProperty;
};
