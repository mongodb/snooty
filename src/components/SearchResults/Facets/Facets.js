import React from 'react';
import useFacets from './useFacets';
import FacetOption from './FacetOption';

const Facets = () => {
  const facets = useFacets();

  return (
    <div>
      {facets?.length > 0 &&
        facets.map((facetOption) => {
          return <FacetOption key={facetOption.id} facetOption={facetOption} />;
        })}
    </div>
  );
};

export default Facets;
