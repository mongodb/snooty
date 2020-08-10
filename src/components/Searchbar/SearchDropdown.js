import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { css, keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import { uiColors } from '@leafygreen-ui/palette';
import useScreenSize from '../../hooks/useScreenSize';
import { theme } from '../../theme/docsTheme';
import AdvancedFiltersPane from './AdvancedFiltersPane';
import Pagination from './Pagination';
import SearchResults from './SearchResults';
import SearchContext from './SearchContext';

const RESULTS_PER_PAGE = 3;
const SEARCH_FOOTER_DESKTOP_HEIGHT = theme.size.xlarge;
const SEARCH_RESULTS_DESKTOP_HEIGHT = '368px';

const baseFooterButtonStyle = css`
  font-family: Akzidenz;
  font-size: ${theme.fontSize.small};
  letter-spacing: 0.5px;
  line-height: ${theme.size.default};
  margin: 0;
  padding: ${theme.size.tiny};
  /* Below removes default hover effects from button */
  background: none;
  background-image: none;
  border: none;
  box-shadow: none;
  :before {
    display: none;
  }
  :after {
    display: none;
  }
`;

const animationKeyframe = startingOpacity => keyframes`
    0% {
      opacity: ${startingOpacity};
    }
    100% {
      opacity: 1;
    }
`;

const fadeInAnimation = (startingOpacity, seconds) => css`
  animation: ${animationKeyframe(startingOpacity)};
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: ${seconds};
`;

const FixedHeightFiltersPane = styled(AdvancedFiltersPane)`
  height: ${SEARCH_RESULTS_DESKTOP_HEIGHT};
  padding-left: ${theme.size.medium};
  padding-right: ${theme.size.medium};
`;

const FixedHeightSearchResults = styled(SearchResults)`
  height: ${SEARCH_RESULTS_DESKTOP_HEIGHT};
`;

const SearchResultsContainer = styled('div')`
  background-color: #ffffff;
  border-radius: 0 0 ${theme.size.tiny} ${theme.size.tiny};
  opacity: 1;
  position: absolute;
  top: ${theme.size.default};
  width: 100%;
  z-index: -1;
  ${fadeInAnimation(0, '0.2s')};
  @media ${theme.screenSize.upToSmall} {
    background-color: ${uiColors.gray.light3};
    bottom: 0;
    top: 40px;
  }
`;

const SearchFooter = styled('div')`
  align-items: center;
  box-shadow: 0 0 ${theme.size.tiny} 0 rgba(184, 196, 194, 0.64);
  display: flex;
  height: ${SEARCH_FOOTER_DESKTOP_HEIGHT};
  justify-content: space-between;
  position: relative;
  padding-left: ${theme.size.default};
  padding-right: ${theme.size.default};
  width: 100%;
  @media ${theme.screenSize.upToSmall} {
    display: none;
  }
`;

const FilterFooterButton = styled(Button)`
  color: ${uiColors.blue.base};
  font-weight: bolder;
  ${baseFooterButtonStyle};
`;

const FilterResetButton = styled(Button)`
  color: ${uiColors.gray.base};
  :hover,
  :active {
    color: ${uiColors.blue.base};
  }
  ${baseFooterButtonStyle};
`;

const SearchDropdown = ({ results = [], applySearchFilter }) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [visibleResults, setVisibleResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { searchFilter, setSearchFilter } = useContext(SearchContext);
  // Number of filters is always 2, since branch is inferred when a product is picked
  const filterText = useMemo(() => (searchFilter ? ' (2)' : ''), [searchFilter]);
  const { isMobile } = useScreenSize();
  const totalPages = results ? Math.ceil(results.length / RESULTS_PER_PAGE) : 0;
  const closeFiltersPane = useCallback(() => setShowAdvancedFilters(false), []);
  const openFiltersPane = useCallback(() => setShowAdvancedFilters(true), []);
  const onReset = useCallback(() => {
    setSearchFilter(null);
    applySearchFilter();
  }, [applySearchFilter, setSearchFilter]);
  const onApplyFilters = useCallback(() => {
    applySearchFilter();
    closeFiltersPane();
  }, [applySearchFilter, closeFiltersPane]);
  useEffect(() => {
    if (isMobile) {
      // If mobile, we give an overflow view, so no pagination is needed
      setVisibleResults(results);
    } else {
      const start = (currentPage - 1) * RESULTS_PER_PAGE;
      const end = currentPage * RESULTS_PER_PAGE;
      setVisibleResults(results.slice(start, end));
    }
  }, [currentPage, isMobile, results]);
  return showAdvancedFilters ? (
    <SearchResultsContainer>
      <FixedHeightFiltersPane closeFiltersPane={closeFiltersPane} />
      <SearchFooter>
        <FilterResetButton onClick={onReset}>Reset</FilterResetButton>
        <FilterFooterButton onClick={onApplyFilters}>Apply Search Criteria{filterText}</FilterFooterButton>
      </SearchFooter>
    </SearchResultsContainer>
  ) : (
    <SearchResultsContainer>
      <FixedHeightSearchResults totalResultsCount={results.length} visibleResults={visibleResults} />
      <SearchFooter>
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        <FilterFooterButton onClick={openFiltersPane}>Advanced Filters{filterText}</FilterFooterButton>
      </SearchFooter>
    </SearchResultsContainer>
  );
};

export default SearchDropdown;
