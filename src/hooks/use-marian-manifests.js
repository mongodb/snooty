import { useEffect, useState } from 'react';
import { parseMarianManifests } from '../utils/parse-marian-manifests';
import { MARIAN_URL } from '../constants';

export const useMarianManifests = (organizeByManifest) => {
  const [filters, setFilters] = useState({});

  useEffect(() => {
    async function fetchManifests() {
      const result = await fetch(MARIAN_URL + `status`);
      const jsonResult = await result.json();
      setFilters(parseMarianManifests(jsonResult.manifests, organizeByManifest));
    }
    fetchManifests();
  }, [organizeByManifest]);

  return { filters };
};
