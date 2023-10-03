import React, { useCallback, useContext } from 'react';
import styled from '@emotion/styled';
import Tag, { searchTagStyle } from '../../Tag';
import SearchContext from '../SearchContext';
import useFacets from './useFacets';
import { initChecked } from './FacetValue';

// util to get all current facets, derived from search params
const getActiveFacets = (facetOptions, searchParams) => {
  const res = [];

  function checkFacetValue(facetValues) {
    for (const facetValue of facetValues) {
      // if it exists in search params, include
      if (initChecked(searchParams, facetValue.key, facetValue.id)) {
        res.push(facetValue);
      }

      // search its descendant options
      if (facetValue.facets) {
        checkFacetGroup(facetValue.facets);
      }
    }
  }

  function checkFacetGroup(facetOptions) {
    for (const facetOption of facetOptions) {
      checkFacetValue(facetOption.options);
    }
  }

  checkFacetGroup(facetOptions);

  return res;
};

const StyledTag = styled(Tag)`
  ${searchTagStyle}
`;

const FacetTag = ({ facet: { name, key, id } }) => {
  const { handleFacetChange } = useContext(SearchContext);
  const onClick = useCallback(
    ({ target }) => {
      // manually set target checked to false. mimic checkbox event
      target.checked = false;
      handleFacetChange({ target, key, id });
    },
    [handleFacetChange, id, key]
  );

  return <StyledTag onClick={onClick}>{name}</StyledTag>;
};

const FacetTags = () => {
  const { searchParams } = useContext(SearchContext);
  const facets = useFacets();
  const activeFacets = getActiveFacets(facets, searchParams);

  return (
    <>
      {activeFacets.map((facet) => (
        <FacetTag facet={facet} key={facet.id}></FacetTag>
      ))}
    </>
  );
};

export default FacetTags;
