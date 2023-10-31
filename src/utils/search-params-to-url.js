import { MARIAN_URL } from '../constants';
import { FACETS_KEY_PREFIX } from '../components/SearchResults/SearchContext';
import { assertTrailingSlash } from './assert-trailing-slash';

const TERM_PARAM = 'q';
const PAGE_PARAM = 'page';
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

/**
 * Search helper function to generate marian URL from params and filters
 * Extracts query params from search params and appends to new request URL as string
 * Route is used to return search document results
 *
 * @param {URLSearchParams} searchParams
 */
export const searchParamsToURL = (searchParams) => {
  const searchTerm = searchParams.get(TERM_PARAM);
  const page = searchParams.get(PAGE_PARAM) || 1;
  const searchProperty = searchParams.get(V1_SEARCH_FILTER_PARAM);
  const filters = getFilterParams(searchParams);

  const queryParams = `?q=${searchTerm}&page=${page}${searchProperty ? `&searchProperty=${searchProperty}` : ''}${
    filters.length ? `&${filters}&combineFilters=true` : ''
  }`;
  return `${assertTrailingSlash(MARIAN_URL)}search${queryParams}`;
};

/**
 * Search helper function to generate marian URL from params and filters
 * Extracts query params from search params and appends to new request URL as string
 * Route is used to return meta data for search params
 *
 * @param {URLSearchParams} searchParams
 */
export const searchParamsToMetaURL = (searchParams) => {
  const searchTerm = searchParams.get(TERM_PARAM);
  const searchProperty = searchParams.get(V1_SEARCH_FILTER_PARAM);
  const filters = getFilterParams(searchParams);

  const queryParams = `?q=${searchTerm}${searchProperty ? `&searchProperty=${searchProperty}` : ''}${
    filters.length ? `&${filters}&combineFilters=true` : ''
  }`;
  const META_PATH = `v2/search/meta`;
  return `${assertTrailingSlash(MARIAN_URL)}${META_PATH}${queryParams}`;
};
