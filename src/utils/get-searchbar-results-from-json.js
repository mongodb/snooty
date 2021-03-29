// Helper function which extracts a marian title based on the format
// title — property. Also optionally only parse the first 9 results for the dropdown

export const getSearchbarResultsFromJSON = (resultJSON, limitResults) => {
  const resultsWithoutProperty = resultJSON.results.map((r) => ({ ...r, title: r.title.split(' —')[0] }));
  if (limitResults) {
    return resultsWithoutProperty.slice(0, limitResults);
  }
  return resultsWithoutProperty;
};
