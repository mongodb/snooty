import React, { useContext } from 'react';
import SearchContext from '../SearchContext';
import FacetGroup from './FacetGroup';

const Facets = () => {
  const { facets } = useContext(SearchContext);

  return (
    <div data-testid="facets-container">
      {facets?.length > 0 &&
        facets.map((facetOption) => {
          return <FacetGroup key={facetOption.id} facetOption={facetOption} />;
        })}
    </div>
  );
};

export default Facets;
