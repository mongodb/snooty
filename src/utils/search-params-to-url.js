import { MARIAN_URL } from '../constants';
import { FACETS_KEY_PREFIX } from '../components/SearchResults/SearchContext';
import { assertTrailingSlash } from './assert-trailing-slash';

const TERM_PARAM = 'q';
const PAGE_PARAM = 'p';
const V1_SEARCH_FILTER_PARAM = 'searchProperty';
const V2_SEARCH_FILTER_PREFIX = FACETS_KEY_PREFIX;

const getFilterParams = (searchParams) => {
  const res = [];
  searchParams.forEach((value, key) => {
    if (key.startsWith(V2_SEARCH_FILTER_PREFIX)) {
      res.push(`${key}=${value}`);
    }
  });
  return res.join('&');
};

// Search helper function to generate marian URL from params and filters
export const searchParamsToURL = (searchParams) => {
  const searchTerm = searchParams.get(TERM_PARAM);
  const page = searchParams.get(PAGE_PARAM) || 1;
  const searchProperty = searchParams.get(V1_SEARCH_FILTER_PARAM);
  const filters = getFilterParams(searchParams);

  const queryParams = `?q=${searchTerm}&page=${page}${searchProperty ? `&searchProperty=${searchProperty}` : ''}${
    filters.length ? `&${filters}` : ''
  }`;
  return `${assertTrailingSlash(MARIAN_URL)}search${queryParams}`;
};
/**
 *
 * @param {string} searchQuery
 * @param {string} searchFilters
 * @param {string[]} facetSelections
 */
export const searchParamsToMetaURL = (searchParams) => {
  const searchTerm = searchParams.get(TERM_PARAM);
  const searchProperty = searchParams.get(V1_SEARCH_FILTER_PARAM);
  const filters = getFilterParams(searchParams);

  const queryParams = `?q=${searchTerm}${searchProperty ? `&searchProperty=${searchProperty}` : ''}${
    filters.length ? `&${filters}` : ''
  }`;
  const META_PATH = `v2/search/meta`;
  return `${assertTrailingSlash(MARIAN_URL)}${META_PATH}${queryParams}`;
};
