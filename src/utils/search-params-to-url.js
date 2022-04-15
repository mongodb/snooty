import { DOCS_URL, MARIAN_URL } from '../constants';
import { assertTrailingSlash } from './assert-trailing-slash';

// Search helper function to generate marian URL from params and filters
export const searchParamsToURL = (searchQuery, searchFilters, isMarian = true) => {
  const queryParams = `?q=${searchQuery}${searchFilters ? `&searchProperty=${searchFilters}` : ''}`;
  const url = isMarian ? MARIAN_URL : DOCS_URL;
  return `${assertTrailingSlash(url)}search${queryParams}`;
};
