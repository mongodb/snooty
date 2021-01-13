// Search helper function to generate marian URL from params and filters
const MARIAN_URL = 'https://marian.mongodb.com/';
const DOCS_URL = 'https://docs.mongodb.com/';
export const searchParamsToURL = (searchQuery, searchFilters, isMarian = true) => {
  const queryParams = `?q=${searchQuery}${searchFilters ? `&searchProperty=${searchFilters}` : ''}`;
  const url = isMarian ? MARIAN_URL : DOCS_URL;
  return `${url}search${queryParams}`;
};
