// Helper function which extracts a marian title based on the format
// title — property. Also optionally only parse the first 9 results for the dropdown

export const getSearchbarResultsFromJSON = (resultJSON, searchPropertyMapping = {}, limitResults) => {
  const resultsWithoutProperty = resultJSON.results
    .filter((r) => {
      const searchProperty = r.searchProperty?.[0];
      const endsWithDash = searchProperty?.endsWith('-');
      const isInMapping = !!searchPropertyMapping[searchProperty];
      return !endsWithDash && isInMapping;
    })
    .map((r) => ({ ...r, title: r.title.split(' —')[0] }));
  if (limitResults) {
    return resultsWithoutProperty.slice(0, limitResults);
  }
  return resultsWithoutProperty;
};
