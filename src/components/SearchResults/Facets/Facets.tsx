import React from 'react';
import FacetGroup from './FacetGroup';

const Facets = ({ facets }) => {
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
