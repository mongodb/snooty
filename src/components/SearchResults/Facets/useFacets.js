import { useEffect, useState } from 'react';
// import { assertTrailingSlash } from '../../../utils/assert-trailing-slash';
import { statusV2 } from '../../../../tests/unit/data/SearchResults.test.json';
// import { MARIAN_URL } from '../../../constants';

const useFacets = () => {
  const [facets, setFacets] = useState([]);

  // Fetch facets
  useEffect(() => {
    const fetchFacets = async () => {
      // DOP-4081
      // TODO: remove after testing version facets
      setFacets(statusV2);
      // try {
      //   const result = await fetch(assertTrailingSlash(MARIAN_URL) + 'v2/status');
      //   const jsonResult = await result.json();
      //   setFacets(jsonResult);
      // } catch (err) {
      //   console.error(`Failed to fetch facets: ${err}`);
      // }
    };
    fetchFacets();
  }, []);

  return facets;
};

export default useFacets;
