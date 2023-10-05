import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { Overline } from '@leafygreen-ui/typography';
import { theme } from '../../../theme/docsTheme';
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

const clearButtonStyling = css`
  text-transform: uppercase;
  font-weight: 500;
  column-gap: ${theme.size.small};
`;

const MAX_HEIGHT = 30;

const TagsFlexbox = styled('div')`
  display: flex;
  flex: 0 1 auto;
  transition: max-height 0.15s ease-out;
  overflow: hidden;
`;

const SelectionsFlexbox = styled('div')`
  display: flex;
  flex-wrap: wrap;
  row-gap: 8px;
  max-height: ${(props) => (!props.expanded ? `${MAX_HEIGHT}px` : 'unset')};
  align-items: center;
`;

const ExpandFlexbox = styled('div')`
  display: flex;
  flex: 0 0 fit-content;
`;

const overlineStyling = css`
  color: ${palette.gray.dark2};
  margin-right: ${theme.size.small};
`;

const FacetTag = ({ facet: { name, key, id } }) => {
  const { handleFacetChange } = useContext(SearchContext);
  const onClick = useCallback(
    ({ target }) => {
      // mimic checkbox event, manually set target checked to false
      target.checked = false;
      handleFacetChange({ target, key, id });
    },
    [handleFacetChange, id, key]
  );

  return <StyledTag onClick={onClick}>{name}</StyledTag>;
};

const FacetTags = ({ resultsCount }) => {
  const { searchParams, clearFacets } = useContext(SearchContext);
  const facets = useFacets();
  // don't have to use state since facet filters are
  // derived from URL state (search params)
  const activeFacets = getActiveFacets(facets, searchParams);

  const [expanded, setExpanded] = useState(false);

  const [needExpansion, setNeedExpansion] = useState(false);
  const refContainer = useRef();

  useEffect(() => {
    if (!refContainer.current) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      console.log('need expansion ', entries[0]?.target?.clientHeight);
      setNeedExpansion(entries[0]?.target?.clientHeight >= MAX_HEIGHT);
    });
    resizeObserver.observe(refContainer.current);
    return () => resizeObserver.disconnect(); // clean up
  }, []);

  const clickHandle = useCallback((newExpanded) => {
    setExpanded(newExpanded);
  }, []);

  return (
    <TagsFlexbox>
      <SelectionsFlexbox ref={refContainer} expanded={expanded}>
        {Number.isInteger(resultsCount) && (
          <Overline className={cx(overlineStyling)}>
            <>{resultsCount} RESULTS</>
          </Overline>
        )}
        {activeFacets.map((facet) => (
          <FacetTag facet={facet} key={facet.id}></FacetTag>
        ))}
        {needExpansion && expanded && (
          <StyledTag variant={'purple'} onClick={() => clickHandle(false)}>
            Show Less
          </StyledTag>
        )}
        {expanded && activeFacets.length > 0 && (
          <StyledTag variant={'gray'} className={cx(clearButtonStyling)} onClick={clearFacets}>
            clear all filters <Icon glyph="X"> </Icon>
          </StyledTag>
        )}
      </SelectionsFlexbox>
      {!expanded && (
        <ExpandFlexbox>
          {needExpansion && (
            <StyledTag variant={'purple'} onClick={() => clickHandle(true)}>
              Show More
            </StyledTag>
          )}
          {activeFacets.length > 0 && (
            <StyledTag variant={'gray'} className={cx(clearButtonStyling)} onClick={clearFacets}>
              clear all filters <Icon glyph="X"> </Icon>
            </StyledTag>
          )}
        </ExpandFlexbox>
      )}
    </TagsFlexbox>
  );
};

export default FacetTags;
