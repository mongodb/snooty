import { useEffect, useState } from 'react';
import { parseMarianManifests } from '../utils/parse-marian-manifests';

export const useMarianManifests = () => {
  const [filters, setFilters] = useState({});

  useEffect(() => {
    async function fetchManifests() {
      const result = await fetch('https://docs-search-transport.mongodb.com/status');
      const jsonResult = await result.json();
      setFilters(parseMarianManifests(jsonResult.manifests));
    }
    fetchManifests();
  }, []);

  return { filters };
};
