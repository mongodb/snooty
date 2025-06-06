import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import { css, cx } from '@leafygreen-ui/emotion';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { palette } from '@leafygreen-ui/palette';
import { Overline } from '@leafygreen-ui/typography';

import { theme } from '../../../theme/docsTheme';
import Tag, { searchTagStyle } from '../../Tag';
import SearchContext from '../SearchContext';
import { FacetOption, FacetValue } from '../../../types/data';
import { initChecked } from './FacetValue';
import { getFacetTagVariant } from './utils';

// util to get all current facets, derived from search params
const getActiveFacets = (facetOptions: Array<FacetOption>, searchParams: URLSearchParams) => {
  const res: Array<FacetValue> = [];

  function checkFacetValue(facetValues: Array<FacetValue>) {
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

  function checkFacetGroup(facetOptions: Array<FacetOption>) {
    for (const facetOption of facetOptions) {
      checkFacetValue(facetOption.options);
    }
  }

  checkFacetGroup(facetOptions);

  return res;
};

const StyledTag = styled(Tag)`
  column-gap: ${theme.size.small};
  ${searchTagStyle}
`;

const clearButtonStyling = css`
  text-transform: uppercase;
  font-weight: 500;
`;

const MAX_HEIGHT = 30;

const TagsFlexbox = styled('div')`
  display: flex;
  flex: 0 1 auto;
  transition: max-height 0.15s ease-out;
  overflow: hidden;
`;

const SelectionsFlexbox = styled('div')<{ expanded: boolean }>`
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

const overlineBaseStyling = css`
  margin-right: ${theme.size.small};
`;

const overlineLightStyling = css`
  color: ${palette.gray.dark2};
  ${overlineBaseStyling}
`;

const FacetTag = ({ facet }: { facet: FacetValue }) => {
  const { handleFacetChange } = useContext(SearchContext);
  const { name, key, id, facets } = facet;
  const onClick = useCallback(() => {
    // if the Facet has any sub facet options, include those in change
    const facetsToDeselect: Array<FacetValue> = [{ ...facet, checked: false }];
    for (const subFacet of facets) {
      if (!subFacet.options) {
        continue;
      }
      // Very confused by the naming here. I think these are facetValues not facetOptions
      for (const facetOption of subFacet?.options) {
        facetsToDeselect.push({
          ...facetOption,
          key: facetOption.key,
          id: facetOption.id,
          checked: false,
        });
      }
    }
    handleFacetChange(facetsToDeselect);
  }, [facet, facets, handleFacetChange]);

  return (
    <StyledTag variant={getFacetTagVariant({ key, id })} onClick={onClick}>
      {name}
      <Icon glyph="X" />
    </StyledTag>
  );
};

const ClearFacetsTag = ({ onClick }: { onClick: () => void }) => (
  <StyledTag variant={'gray'} className={cx(clearButtonStyling)} onClick={onClick}>
    clear all filters <Icon glyph="X" />
  </StyledTag>
);

const FacetTags = ({ resultsCount }: { resultsCount?: number }) => {
  const { searchParams, clearFacets, facets } = useContext(SearchContext);
  // don't have to use state since facet filters are
  // derived from URL state (search params)
  const activeFacets = useMemo(() => getActiveFacets(facets, searchParams), [facets, searchParams]);

  const [expanded, setExpanded] = useState(false);

  const [needExpansion, setNeedExpansion] = useState(false);
  const refContainer = useRef<HTMLDivElement>(null);
  const { darkMode } = useDarkMode();

  // resize affect. show/hide `Show More` button if there is no real estate
  useEffect(() => {
    if (!refContainer.current) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      setNeedExpansion(entries[0]?.target?.clientHeight >= MAX_HEIGHT);
    });
    resizeObserver.observe(refContainer.current);
    return () => resizeObserver.disconnect(); // clean up
  }, []);

  const clickHandle = useCallback((newExpanded: boolean) => {
    setExpanded(newExpanded);
  }, []);

  return (
    <TagsFlexbox>
      <SelectionsFlexbox ref={refContainer} expanded={expanded}>
        {Number.isInteger(resultsCount) && (
          <Overline
            className={cx({
              [overlineBaseStyling]: darkMode === true,
              [overlineLightStyling]: darkMode === false,
            })}
          >
            <>{resultsCount} RESULTS</>
          </Overline>
        )}
        {activeFacets.map((facet) => (
          <FacetTag facet={facet} key={facet.id}></FacetTag>
        ))}
        {needExpansion && expanded && (
          <StyledTag variant={'gray'} onClick={() => clickHandle(false)}>
            Show Less
          </StyledTag>
        )}
        {expanded && activeFacets.length > 0 && <ClearFacetsTag onClick={clearFacets}></ClearFacetsTag>}
      </SelectionsFlexbox>
      {!expanded && (
        <ExpandFlexbox>
          {needExpansion && (
            <StyledTag variant={'gray'} onClick={() => clickHandle(true)}>
              Show More
            </StyledTag>
          )}
          {activeFacets.length > 0 && <ClearFacetsTag onClick={clearFacets}></ClearFacetsTag>}
        </ExpandFlexbox>
      )}
    </TagsFlexbox>
  );
};

export default FacetTags;
