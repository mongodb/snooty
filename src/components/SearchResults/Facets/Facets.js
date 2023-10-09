import React from 'react';
import useFacets from './useFacets';
import FacetGroup from './FacetGroup';

const Facets = () => {
  const facets = useFacets();

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
