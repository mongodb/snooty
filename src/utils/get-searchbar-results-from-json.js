// Helper function which extracts a marian title based on the format
// title — property
export const getSearchbarResultsFromJSON = resultJSON =>
  resultJSON.results.map(r => ({ ...r, title: r.title.split(' —')[0] }));
