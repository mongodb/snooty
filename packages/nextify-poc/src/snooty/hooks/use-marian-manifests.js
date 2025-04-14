import { useEffect, useState } from 'react';
import { assertTrailingSlash } from '../utils/assert-trailing-slash';
import { parseMarianManifests } from '../utils/parse-marian-manifests';
import { MARIAN_URL } from '../constants';
import { fetchSearchPropertyMapping } from '../utils/realm';
import { requestHeaders } from '../utils/search-facet-constants';
import { useSiteMetadata } from './use-site-metadata';

// Fetches manifests for search results and the mapping between search properties and their category/version names.
export const useMarianManifests = () => {
  const [filters, setFilters] = useState({});
  const { snootyEnv } = useSiteMetadata();
  const [searchPropertyMapping, setSearchPropertyMapping] = useState({});

  useEffect(() => {
    async function fetchManifests(propertyMapping) {
      try {
        const result = await fetch(assertTrailingSlash(MARIAN_URL) + `status`, requestHeaders);
        const jsonResult = await result.json();
        setFilters(parseMarianManifests(jsonResult.manifests, propertyMapping));
      } catch (err) {
        console.error('Failed to fetch the MARIAN_URL.', err);
      }
    }
    const fetchMapping = async () => {
      let mapping = {};
      try {
        mapping = await fetchSearchPropertyMapping(snootyEnv);
        // searchPropertyMapping should be in the form:
        // { 'atlas-master': { categoryTitle: 'Atlas', versionSelectorLabel: 'Latest' } }
        setSearchPropertyMapping(mapping);
      } catch (err) {
        console.error('Failed to fetch search property mapping.', err);
      }
      return mapping;
    };
    fetchMapping().then((mapping) => {
      fetchManifests(mapping);
    });
  }, [snootyEnv]);

  return { filters, searchPropertyMapping };
};
