import React, { useCallback, useContext, useMemo } from 'react';
import Checkbox from '@leafygreen-ui/checkbox';
import { css, cx } from '@leafygreen-ui/emotion';
import SearchContext from '../SearchContext';
import FacetOption from './FacetOption';

const nestedFacetStyle = css`
  margin-left: 22px;
`;

const checkboxStyle = css`
  // Target the label
  span {
    font-size: 13px;
  }
`;

const initChecked = (searchParams, key, id) => searchParams.getAll(`facets.${key}`).includes(id);
/**
 * @param {URLSearchParams} searchParams
 * @param {object[]} nestedSubFacets
 * @param {string} fullFacetId
 */
const findNumSelectedSubFacets = (searchParams, nestedSubFacets, fullFacetId) => {
  let count = 0;
  for (const [paramKey, val] of searchParams.entries()) {
    if (
      paramKey.includes(fullFacetId) &&
      !!nestedSubFacets.find(({ key, id }) => `facets.${key}` === paramKey && id === val)
    ) {
      count++;
    }
  }
  return count;
};

// Representative of a "facet-option" from search server response. These are
// facets that the user can select to filter search
const FacetValue = ({ facetValue: { name, facets, key, id } }) => {
  const { handleFacetChange, searchParams } = useContext(SearchContext);
  const isAtlasProduct = key === 'target_product' && id === 'atlas';
  // Differentiate between facets with the same id found under different facet options
  const fullFacetId = `${key}>${id}`;
  // Decide on initial state based on selected facets deduced from query params
  const isChecked = initChecked(searchParams, key, id);
  const nestedSubFacets = useMemo(() => {
    // Flatten the available facet values for an arbitrary amount of nested facet
    // options (i.e. subfacets)
    return facets.reduce((acc, facetOption) => {
      acc.push(...facetOption.options);
      return acc;
    }, []);
  }, [facets]);
  // const numSelectedSubProducts = selectedFacets.filter((selectedFacet) => {
  //   return selectedFacet.key.includes(fullFacetId);
  // }).length;
  // const numSelectedSubProducts = searchParams.getAll
  const numSelectedSubProducts = findNumSelectedSubFacets(searchParams, nestedSubFacets, fullFacetId);

  const isIndeterminate = numSelectedSubProducts > 0 && numSelectedSubProducts !== nestedSubFacets.length;

  const onChangeHandler = useCallback(
    ({ target }) => {
      const { checked } = target;
      const facetsToUpdate = [];
      // If the Atlas product is selected/deselected, the action should apply to all
      // subfacets
      if (isAtlasProduct) {
        nestedSubFacets.forEach(({ key, id }) => {
          facetsToUpdate.push({ key, id });
        });
      }
      facetsToUpdate.push({ key, id });
      handleFacetChange(facetsToUpdate, checked);
    },
    [handleFacetChange, key, id, isAtlasProduct, nestedSubFacets]
  );

  return (
    <>
      <Checkbox
        className={cx(checkboxStyle)}
        label={name}
        onChange={onChangeHandler}
        checked={isChecked}
        id={fullFacetId}
        indeterminate={isIndeterminate}
      />
      {(isChecked || isAtlasProduct) &&
        facets.map((facet) => {
          return <FacetOption key={facet.id} className={cx(nestedFacetStyle)} facetOption={facet} isNested={true} />;
        })}
    </>
  );
};

export default FacetValue;
