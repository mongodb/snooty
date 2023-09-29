import { useEffect, useState } from 'react';
// Temporarily use test data while awaiting changes from search endpoint
import { statusV2 } from '../../../../tests/unit/data/SearchResults.test.json';

const useFacets = () => {
  const [facets, setFacets] = useState([]);

  // Fetch facets
  useEffect(() => {
    const fetchFacets = async () => {
      setFacets(statusV2);
    };
    fetchFacets();
  }, []);

  return facets;
};

export default useFacets;
