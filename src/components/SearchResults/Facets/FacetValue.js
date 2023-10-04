import React, { useCallback, useContext, useMemo } from 'react';
import Checkbox from '@leafygreen-ui/checkbox';
import { css, cx } from '@leafygreen-ui/emotion';
import SearchContext from '../SearchContext';
import FacetGroup from './FacetGroup';

const checkboxStyle = css`
  // Target the label/text
  label {
    font-size: 13px;
    margin-bottom: 8px;
  }
  }
`;

const initChecked = (searchParams, key, id) => searchParams.getAll(`facets.${key}`).includes(id);

/**
 * Check if the key + value of a query param are actual subfacets.
 * @param {Map<string, Set<string>>} nestedSubFacets
 * @param {string} paramKey
 * @param {string} paramVal
 */
const isParamValidSubFacet = (nestedSubFacets, paramKey, paramVal) => {
  const originalKey = paramKey.split('facets.')[1];
  const ids = nestedSubFacets.get(originalKey);
  return ids.has(paramVal);
};

/**
 * Finds the number of sub facets that are currently selected, based on the current
 * query params.
 * @param {URLSearchParams} searchParams
 * @param {Map<string, Set<string, string>>} nestedSubFacets
 * @param {string} fullFacetId
 */
const findNumSelectedSubFacets = (searchParams, nestedSubFacets, fullFacetId) => {
  let count = 0;
  for (const [paramKey, paramVal] of searchParams.entries()) {
    // Ensure that invalid query params do not affect the UI
    if (paramKey.includes(fullFacetId) && isParamValidSubFacet(nestedSubFacets, paramKey, paramVal)) {
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
  // Mapping of nested facet options/groups with the ids for each underlying facet value
  const [nestedSubFacets, totalSubFacets] = useMemo(() => {
    // key: string; value: Set
    const map = new Map();
    let totalCount = 0;
    // Flatten the available facet values for an arbitrary amount of nested facet
    // options (i.e. subfacets). This only flattens up to 1 layer of facet values
    facets.forEach((facetGroup) => {
      facetGroup.options.forEach(({ key, id }) => {
        if (!map.has(key)) {
          map.set(key, new Set());
        }
        const currentSet = map.get(key);
        currentSet.add(id);
        totalCount++;
      });
    });
    return [map, totalCount];
  }, [facets]);
  // Only show an indeterminate state for Atlas products
  const numSelectedSubProducts = isAtlasProduct
    ? findNumSelectedSubFacets(searchParams, nestedSubFacets, fullFacetId)
    : 0;
  const isIndeterminate = numSelectedSubProducts > 0 && numSelectedSubProducts !== totalSubFacets;

  const onChangeHandler = useCallback(
    ({ target }) => {
      const { checked } = target;
      const facetsToUpdate = [];

      const updateNestedFacets = () => {
        nestedSubFacets.forEach((ids, key) => {
          ids.forEach((id) => {
            facetsToUpdate.push({ key, id });
          });
        });
      };

      // If the Atlas product is selected/deselected, the action should apply to all
      // subfacets
      if (isAtlasProduct) {
        updateNestedFacets();
      } else if (!checked) {
        // Perform updates for nested facets for non-Atlas products only for deselection
        updateNestedFacets();
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
          return <FacetGroup key={facet.id} facetOption={facet} isNested={true} />;
        })}
    </>
  );
};

export default FacetValue;
