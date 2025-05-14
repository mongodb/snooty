import { useEffect, useState } from 'react';
import { assertTrailingSlash } from '../../../utils/assert-trailing-slash';
import { requestHeaders } from '../../../utils/search-facet-constants';
import { MARIAN_URL } from '../../../constants';

const useFacets = () => {
  const [facets, setFacets] = useState([]);

  // Fetch facets
  useEffect(() => {
    const fetchFacets = async () => {
      try {
        const result = await fetch(assertTrailingSlash(MARIAN_URL) + 'v2/status', requestHeaders);
        const jsonResult = await result.json();
        setFacets(jsonResult);
      } catch (err) {
        console.error(`Failed to fetch facets: ${err}`);
      }
    };
    fetchFacets();
  }, []);

  return facets;
};

export default useFacets;
