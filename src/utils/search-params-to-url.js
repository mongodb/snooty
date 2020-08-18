import { withPrefix } from 'gatsby';

// Search helper function to generate marian URL from params and filters
const MARIAN_URL = 'https://marian.mongodb.com/';
export const searchParamsToURL = (searchQuery, searchFilters, isMarian = true) => {
  const queryParams = `?q=${searchQuery}${searchFilters ? `&searchProperty=${searchFilters}` : ''}`;
  if (isMarian) {
    return `${MARIAN_URL}search${queryParams}`;
  } else {
    return withPrefix(`search/${queryParams}`);
  }
};
