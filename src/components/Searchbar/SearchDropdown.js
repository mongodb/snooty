import React, { useEffect, useState } from 'react';
import { css, keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import Pagination from './Pagination';
import SearchResults from './SearchResults';

const RESULTS_PER_PAGE = 3;
const SEARCH_FOOTER_DESKTOP_HEIGHT = theme.size.xlarge;

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

const SearchResultsContainer = styled('div')`
  background-color: #ffffff;
  border-radius: 0 0 ${theme.size.tiny} ${theme.size.tiny};
  opacity: 1;
  position: absolute;
  top: ${theme.size.default};
  width: 100%;
  z-index: -1;
  ${fadeInAnimation(0, '0.2s')};
  @media ${theme.screenSize.upToXSmall} {
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
  justify-content: flex-end;
  position: relative;
  padding-left: ${theme.size.default};
  padding-right: ${theme.size.default};
  width: 100%;
  @media ${theme.screenSize.upToXSmall} {
    display: none;
  }
`;

const SearchDropdown = ({ results = [] }) => {
  const [visibleResults, setVisibleResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = results ? Math.ceil(results.length / RESULTS_PER_PAGE) : 0;
  useEffect(() => {
    const start = (currentPage - 1) * RESULTS_PER_PAGE;
    const end = currentPage * RESULTS_PER_PAGE;
    setVisibleResults(results.slice(start, end));
  }, [currentPage, results]);
  return (
    <SearchResultsContainer>
      <SearchResults totalResultsCount={results.length} visibleResults={visibleResults} />
      <SearchFooter>
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
      </SearchFooter>
    </SearchResultsContainer>
  );
};

export default SearchDropdown;
