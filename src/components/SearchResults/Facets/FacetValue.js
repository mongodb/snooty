import React, { useCallback, useContext, useEffect, useMemo } from 'react';
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

export const initChecked = (searchParams, key, id) => searchParams.getAll(`facets.${key}`).includes(id);

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
const FacetValue = ({ facetValue: { name, facets, key, id }, isNested = false }) => {
  const { handleFacetChange, searchParams } = useContext(SearchContext);
  const isAtlasProduct = key === 'target_product' && id === 'atlas';
  // Differentiate between facets with the same id found under different facet options
  const fullFacetId = `${key}>${id}`;
  // Mapping of nested facet options/groups with the ids for each underlying facet value
  const [nestedSubFacets, totalSubFacets] = useMemo(() => {
    // key: string; value: Set
    const map = new Map();
    let totalCount = 0;
    // Consolidate the available facet values for an arbitrary amount of nested facet
    // options (i.e. subfacets). This only consolidates up to 1 layer of facet values
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
  const numSelectedSubProducts =
    totalSubFacets > 0 ? findNumSelectedSubFacets(searchParams, nestedSubFacets, fullFacetId) : 0;
  const isIndeterminate = numSelectedSubProducts > 0 && numSelectedSubProducts !== totalSubFacets;
  const isChecked = totalSubFacets > 0 ? numSelectedSubProducts === totalSubFacets : initChecked(searchParams, key, id);

  const onChangeHandler = useCallback(
    ({ target }) => {
      const { checked } = target;
      const facetsToUpdate = [];

      // Update nested checkboxes when parent is changed
      nestedSubFacets.forEach((ids, key) => {
        ids.forEach((id) => {
          facetsToUpdate.push({ key, id, checked });
        });
      });
      facetsToUpdate.push({ key, id, checked });
      handleFacetChange(facetsToUpdate, checked);
    },
    [handleFacetChange, key, id, nestedSubFacets]
  );

  // Remove query param for parent facet to prevent propagating parent to
  // server when indeterminate. Search server only wants child facets in this case
  useEffect(() => {
    if (totalSubFacets > 0 && isIndeterminate) {
      handleFacetChange([{ key, id, checked: false }]);
    }
  }, [isIndeterminate, totalSubFacets, handleFacetChange, key, id]);

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
      {(isAtlasProduct || isChecked || isIndeterminate) &&
        facets.map((facet) => {
          return <FacetGroup key={facet.id} facetOption={facet} isNested={true} />;
        })}
    </>
  );
};

export default FacetValue;