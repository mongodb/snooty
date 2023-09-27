import React, { useCallback, useContext, useState } from 'react';
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

const FacetValue = ({ facetValue: { name, facets, key, id } }) => {
  const { handleFacetChange, selectedFacets } = useContext(SearchContext);
  // Differentiate between facets with the same id found under different facet options
  const fullFacetId = `${key}>${id}`;
  // Decide on initial state based on selected facets deduced from query params
  const [isChecked, setIsChecked] = useState(() => !!selectedFacets.find((facet) => facet.fullFacetId === fullFacetId));

  const onChangeHandler = useCallback(
    ({ target }) => {
      const { checked } = target;
      setIsChecked(checked);
      handleFacetChange({ target, name, key, id });
    },
    [handleFacetChange, name, key, id]
  );

  return (
    <>
      <Checkbox
        className={cx(checkboxStyle)}
        label={name}
        onChange={onChangeHandler}
        checked={isChecked}
        id={fullFacetId}
      />
      {isChecked &&
        facets.map((facet) => {
          return <FacetOption key={facet.id} className={cx(nestedFacetStyle)} facetOption={facet} isNested={true} />;
        })}
    </>
  );
};

export default FacetValue;
