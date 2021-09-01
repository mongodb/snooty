import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import { useLocation } from '@reach/router';
import queryString from 'query-string';
import { theme } from '../../theme/docsTheme';
import { getSearchbarResultsFromJSON } from '../../utils/get-searchbar-results-from-json';
import { parseMarianManifest } from '../../utils/parse-marian-manifests';
import { reportAnalytics } from '../../utils/report-analytics';
import { searchParamsToURL } from '../../utils/search-params-to-url';
import SearchContext from '../Searchbar/SearchContext';
import SearchFilters from '../Searchbar/SearchFilters';
import SearchResult from '../Searchbar/SearchResult';
import EmptyResults, { EMPTY_STATE_HEIGHT } from './EmptyResults';
import { displayNone } from '../../utils/display-none';

const DESKTOP_COLUMN_GAP = '46px';
const FILTER_BY_TEXT_WIDTH = '62px';
const FILTER_COLUMN_WIDTH = '173px';
const LANDING_MODULE_MARGIN = '28px';
const LANDING_PAGE_MARGIN = '40px';
const MAX_MOBILE_WIDTH = '616px';
const ROW_GAP = theme.size.default;
const SEARCH_RESULT_HEIGHT = '128px';

const CALC_MARGIN = `calc(50vh - ${LANDING_MODULE_MARGIN} - ${LANDING_PAGE_MARGIN} - ${EMPTY_STATE_HEIGHT} / 2)`;

const commonTextStyling = css`
  font-family: Akzidenz;
  font-weight: bolder;
  letter-spacing: 0.5px;
  margin: 0;
`;

const EmptyResultsContainer = styled('div')`
  /* We want to place the empty state in the middle of the page. To do so, we
  must account for any margins added from using the blank landing template, 
  and half of the height of the empty state component */
  margin-bottom: ${CALC_MARGIN};
  margin-top: ${CALC_MARGIN};
`;

const HeaderText = styled('h1')`
  font-size: 18px;
  line-height: 21px;
  grid-area: header;
  ${commonTextStyling};
  letter-spacing: 0.8px;
`;

const FilterHeader = styled('h2')`
  align-self: center;
  color: ${uiColors.gray.dark2};
  font-size: ${theme.fontSize.tiny};
  grid-area: filter-header;
  line-height: 15px;
  text-transform: uppercase;
  white-space: nowrap;
  ${commonTextStyling};
  ${displayNone.onMobile};
`;

const SearchResultsContainer = styled('div')`
  column-gap: ${DESKTOP_COLUMN_GAP};
  display: grid;
  grid-template-areas: 'header filter-header' 'results filters';
  grid-template-columns: auto ${FILTER_COLUMN_WIDTH};
  margin: ${theme.size.large} auto ${theme.size.xlarge} auto;
  max-width: 1150px;
  row-gap: ${theme.size.large};
  width: 100%;
  @media ${theme.screenSize.upToLarge} {
    align-items: center;
    column-gap: ${theme.size.default};
    grid-template-areas: 'header header' 'filter-header filters' 'results results';
    /* For the middle breakpoint, we want a column for width on specifically this text */
    grid-template-columns: ${FILTER_BY_TEXT_WIDTH} auto;
    margin: 0 auto;
    max-width: ${MAX_MOBILE_WIDTH};
    padding-left: ${theme.size.default};
    padding-right: ${theme.size.default};
  }
  @media ${theme.screenSize.upToSmall} {
    grid-template-areas: 'header' 'filters' 'results';
    grid-template-columns: auto;
  }
`;

const StyledSearchFilters = styled(SearchFilters)`
  grid-area: filters;
  @media ${theme.screenSize.upToLarge} {
    align-items: center;
    display: flex;
    flex-direction: row;
    /* Slightly reduce margins from dropdown search filters */
    > div:first-of-type {
      margin-bottom: 0;
      margin-right: ${theme.size.small};
    }
  }
  @media ${theme.screenSize.upToSmall} {
    flex-direction: column;
    /* Update the fixed width filters on mobile to go full length */
    > div {
      width: 100%;
      :first-of-type {
        margin-bottom: ${theme.size.small};
        margin-right: 0;
      }
      > div {
        width: 100%;
      }
    }
  }
`;

const StyledSearchResult = styled(SearchResult)`
  background-color: #fff;
  border-radius: ${theme.size.tiny};
  box-shadow: 0 0 ${theme.size.tiny} 0 rgba(231, 238, 236, 0.4);
  height: ${SEARCH_RESULT_HEIGHT};
  position: relative;
  /* place-self adds both align-self and justify-self for flexbox */
  place-self: center;
  width: 100%;
  > div {
    padding: ${theme.size.medium};
  }
  :hover,
  :focus {
    color: unset;
    text-decoration: unset;
    > div {
      background-color: unset !important;
    }
  }

  /* Create a pseudoelement to take up space between rows for hover effect */
  :before {
    content: '';
    position: absolute;
    top: calc(-${ROW_GAP} / 2);
    left: 0;
    right: 0;
    bottom: calc(-${ROW_GAP} / 2);
    background-color: transparent;
  }
`;

const StyledSearchResults = styled('div')`
  box-shadow: none;
  display: grid;
  grid-area: results;
  /* Build space between rows into row height for hover effect */
  grid-auto-rows: calc(${SEARCH_RESULT_HEIGHT} + ${ROW_GAP});
  height: 100%;
  width: 100%;
  /* Create the opaque effect on hover by opaquing everything but a hovered result */
  :hover {
    > ${StyledSearchResult} {
      opacity: 0.2;
      transition: opacity 150ms ease-in;
      :hover {
        opacity: 1;
      }
    }
  }
  :not(:hover) {
    > ${StyledSearchResult} {
      opacity: 1;
      transition: opacity 150ms ease-in;
    }
  }
`;

const SearchResults = () => {
  const { search } = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [searchFilter, setSearchFilter] = useState(null);
  const [searchFilterProperty, setSearchFilterProperty] = useState(null);

  // This page has a unique BG color
  useEffect(() => {
    if (document) {
      document.body.style.backgroundColor = '#F9FBFA';
    }
  }, []);

  // Parse the incoming query string for a search term and property
  useEffect(() => {
    const { q, searchProperty } = queryString.parse(search);
    setSearchTerm(q);
    setSearchFilter(searchProperty);
  }, [search]);

  // Update results on a new search query or filters
  // When the filter is changed, find the corresponding property to display
  useEffect(() => {
    const fetchNewSearchResults = async () => {
      if (searchTerm) {
        const result = await fetch(searchParamsToURL(searchTerm, searchFilter));
        const resultJson = await result.json();
        setSearchResults(getSearchbarResultsFromJSON(resultJson));
      }
    };
    fetchNewSearchResults();
    if (searchFilter) {
      const { property } = parseMarianManifest(searchFilter);
      setSearchFilterProperty(property);
    }
  }, [searchFilter, searchTerm]);

  return (
    <SearchContext.Provider value={{ searchFilter, searchTerm, setSearchFilter }}>
      <Helmet>
        <title>Search Results</title>
      </Helmet>
      {searchResults && searchResults.length ? (
        <SearchResultsContainer>
          <HeaderText>
            {searchFilterProperty ? `${searchFilterProperty} results` : 'All search results'} for "{searchTerm}"
          </HeaderText>
          <StyledSearchResults>
            {searchResults.map(({ title, preview, url }, index) => (
              <StyledSearchResult
                key={`${url}${index}`}
                onClick={() =>
                  reportAnalytics('SearchSelection', { areaFrom: 'ResultsPage', rank: index, selectionUrl: url })
                }
                title={title}
                preview={preview}
                url={url}
                useLargeTitle
              />
            ))}
          </StyledSearchResults>
          <FilterHeader>Filter By</FilterHeader>
          <StyledSearchFilters hasSideLabels={false} />
        </SearchResultsContainer>
      ) : (
        <EmptyResultsContainer>
          <EmptyResults />
        </EmptyResultsContainer>
      )}
    </SearchContext.Provider>
  );
};

export default SearchResults;
