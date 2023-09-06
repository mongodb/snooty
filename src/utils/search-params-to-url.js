import { MARIAN_URL } from '../constants';
import { baseUrl } from './base-url';
import { assertTrailingSlash } from './assert-trailing-slash';

// Search helper function to generate marian URL from params and filters
export const searchParamsToURL = (searchQuery, searchFilters, pageNumber = 1, isMarian = true) => {
  const queryParams = `?q=${searchQuery}&page=${pageNumber}${searchFilters ? `&searchProperty=${searchFilters}` : ''}`;
  const url = isMarian ? MARIAN_URL : baseUrl();
  return `${assertTrailingSlash(url)}search${queryParams}`;
};
/**
 *
 * @param {string} searchQuery
 * @param {string} searchFilters
 * @param {{key}[]} facetSelections
 */
export const searchParamsToMetaURL = (searchQuery, searchFilters, facetSelections) => {
  let queryParams = `?q=${searchQuery}${searchFilters ? `&searchProperty=${searchFilters}` : ''}`;
  // for (const facetSelection of facetSelections) {
  //   for (const facetKey in facetSelection) {
  //     queryParams += `&facets.${facetKey}=${facetSelection[facetKey]}`
  //   }
  // }
  const META_PATH = `v2/search/meta`;
  return assertTrailingSlash(MARIAN_URL) + META_PATH + queryParams;
};
