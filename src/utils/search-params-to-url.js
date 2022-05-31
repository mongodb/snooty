import { MARIAN_URL } from '../constants';
import { baseUrl } from './base-url';
import { assertTrailingSlash } from './assert-trailing-slash';

// Search helper function to generate marian URL from params and filters
export const searchParamsToURL = (searchQuery, searchFilters, isMarian = true) => {
  const queryParams = `?q=${searchQuery}${searchFilters ? `&searchProperty=${searchFilters}` : ''}`;
  const url = isMarian ? MARIAN_URL : baseUrl();
  return `${assertTrailingSlash(url)}search${queryParams}`;
};
