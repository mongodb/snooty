import React from 'react';
import styled from '@emotion/styled';
import useScreenSize from '../../hooks/useScreenSize';
import { theme } from '../../theme/docsTheme';
import SearchResult from './SearchResult';

const SEARCHBAR_HEIGHT = '36px';
const SEARCH_RESULTS_DESKTOP_HEIGHT = '368px';
const SEARCH_RESULT_HEIGHT = '102px';
const SEARCH_RESULT_MOBILE_HEIGHT = '156px';

const StyledResultText = styled('p')`
  font-family: Akzidenz;
  font-size: ${theme.fontSize.small};
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
  @media ${theme.screenSize.upToSmall} {
    box-shadow: none;
    grid-template-rows: ${theme.size.medium};
    grid-auto-rows: ${SEARCH_RESULT_MOBILE_HEIGHT};
    /* On mobile, let the dropdown take the available height */
    height: calc(100% - ${SEARCHBAR_HEIGHT});
    padding-top: ${theme.size.default};
    overflow-y: scroll;
  }
`;

const StyledSearchResult = styled(SearchResult)`
  max-height: 100%;
  height: 100%;
  > div {
    padding: ${theme.size.default} ${theme.size.medium};
  }
  @media ${theme.screenSize.upToSmall} {
    background-color: #fff;
    border: 1px solid rgba(184, 196, 194, 0.2);
    border-radius: ${theme.size.tiny};
    box-shadow: 0 0 ${theme.size.tiny} 0 rgba(231, 238, 236, 0.4);
    height: calc(100% - ${theme.size.default});
    /* place-self adds both align-self and justify-self for flexbox */
    place-self: center;
    width: calc(100% - ${theme.size.large});
    > div {
      padding: ${theme.size.default};
    }
  }
`;

const SearchResults = ({ totalResultsCount, visibleResults }) => {
  const { isMobile } = useScreenSize();
  return (
    <SearchResultsContainer>
      <StyledResultText>
        <strong>Most Relevant Results ({totalResultsCount})</strong>
      </StyledResultText>
      {visibleResults.map(({ title, preview, url }) => (
        <StyledSearchResult key={url} learnMoreLink={isMobile} title={title} preview={preview} url={url} />
      ))}
    </SearchResultsContainer>
  );
};

export default SearchResults;
