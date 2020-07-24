import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../theme/docsTheme';
import SearchResult from './SearchResult';

const SEARCHBAR_HEIGHT = '36px';
const SEARCH_RESULTS_DESKTOP_HEIGHT = '368px';
const SEARCH_RESULT_HEIGHT = '102px';

const StyledResultText = styled('p')`
  font-family: Akzidenz;
  font-size: 14px;
  letter-spacing: 0.5px;
  margin: 0;
  padding-left: ${theme.size.medium};
`;

const SearchResultsContainer = styled('div')`
  align-items: center;
  box-shadow: 0 0 ${theme.size.tiny} 0 rgba(184, 196, 194, 0.48);
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: ${theme.size.medium} ${SEARCH_RESULT_HEIGHT} ${SEARCH_RESULT_HEIGHT} ${SEARCH_RESULT_HEIGHT};
  height: ${SEARCH_RESULTS_DESKTOP_HEIGHT};
  position: relative;
  /* Give top padding on desktop to offset this extending into the searchbar */
  padding-top: 38px;
  width: 100%;
  @media ${theme.screenSize.upToXSmall} {
    box-shadow: none;
    /* On mobile, let the dropdown take the available height */
    height: calc(100% - ${SEARCHBAR_HEIGHT});
    padding-top: 0;
  }
`;

const StyledSearchResult = styled(SearchResult)`
  max-height: 100%;
  height: 100%;
  > div {
    padding: ${theme.size.default} ${theme.size.medium};
  }
`;

const SearchResults = ({ totalResultsCount, visibleResults }) => (
  <SearchResultsContainer>
    <StyledResultText>
      <strong>Most Relevant Results ({totalResultsCount})</strong>
    </StyledResultText>
    {visibleResults.map(({ title, preview, url }) => (
      <StyledSearchResult key={url} title={title} preview={preview} url={url} />
    ))}
  </SearchResultsContainer>
);

export default SearchResults;
