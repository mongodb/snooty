import { useEffect, useState } from 'react';
import { useSiteMetadata } from './use-site-metadata';
import { parseMarianManifests } from '../utils/parse-marian-manifests';
import { MARIAN_URL } from '../constants';
import { fetchSearchPropertyMapping } from '../utils/realm';

// Fetches manifests for search results and the mapping between search properties and their category/version names.
export const useMarianManifests = () => {
  const [filters, setFilters] = useState({});
  const { snootyEnv } = useSiteMetadata();
  const [searchPropertyMapping, setSearchPropertyMapping] = useState({});

  useEffect(() => {
    async function fetchManifests(propertyMapping) {
      const result = await fetch(MARIAN_URL + `status`);
      const jsonResult = await result.json();
      setFilters(parseMarianManifests(jsonResult.manifests, propertyMapping));
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
