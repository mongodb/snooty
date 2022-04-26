import { useEffect, useState } from 'react';
import { parseMarianManifests } from '../utils/parse-marian-manifests';

export const useMarianManifests = (organizeByManifest) => {
  const [filters, setFilters] = useState({});

  useEffect(() => {
    async function fetchManifests() {
      const result = await fetch('https://docs-search-transport.mongodb.com/status');
      const jsonResult = await result.json();
      setFilters(parseMarianManifests(jsonResult.manifests, organizeByManifest));
    }
    fetchManifests();
  }, [organizeByManifest]);

  return { filters };
};
