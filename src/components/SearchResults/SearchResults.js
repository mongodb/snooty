import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useLocation } from '@reach/router';
import Badge from '@leafygreen-ui/badge';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import { uiColors } from '@leafygreen-ui/palette';
import queryString from 'query-string';
import MobileFilters from './MobileFilters';
import { theme } from '../../theme/docsTheme';
import { getSearchbarResultsFromJSON } from '../../utils/get-searchbar-results-from-json';
import { reportAnalytics } from '../../utils/report-analytics';
import { searchParamsToURL } from '../../utils/search-params-to-url';
import SearchContext from '../Searchbar/SearchContext';
import SearchFilters from '../Searchbar/SearchFilters';
import SearchResult from '../Searchbar/SearchResult';
import EmptyResults, { EMPTY_STATE_HEIGHT } from './EmptyResults';
import transformUrlBasedOnOrigin from '../../utils/transform-url-based-on-origin';

const DESKTOP_COLUMN_GAP = '46px';
const FILTER_COLUMN_WIDTH = '173px';
const LANDING_MODULE_MARGIN = '28px';
const LANDING_PAGE_MARGIN = '40px';
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

const HeaderContainer = styled('div')`
  grid-area: header;
`;

const HeaderText = styled('h1')`
  font-size: 18px;
  line-height: 21px;
  ${commonTextStyling};
  letter-spacing: 0.8px;
`;

const FiltersContainer = styled('div')`
  grid-area: filters;
`;

const FilterHeader = styled('h2')`
  align-self: center;
  color: ${uiColors.gray.dark2};
  font-size: ${theme.fontSize.tiny};
  line-height: 15px;
  text-transform: uppercase;
  white-space: nowrap;
  ${commonTextStyling};

  // Override
  margin-bottom: ${theme.size.default};

  @media ${theme.screenSize.upToMedium} {
    display: none;
  }
`;

const SearchResultsContainer = styled('div')`
  column-gap: ${DESKTOP_COLUMN_GAP};
  display: grid;
  grid-template-areas: 'header filter-header' 'results filters';
  grid-template-columns: auto ${FILTER_COLUMN_WIDTH};
  margin: ${theme.size.large} 108px ${theme.size.xlarge} ${theme.size.large};
  max-width: 1150px;
  row-gap: ${theme.size.large};

  @media ${theme.screenSize.upTo2XLarge} {
    margin: ${theme.size.large} 40px ${theme.size.xlarge} 40px;
  }

  @media ${theme.screenSize.upToMedium} {
    column-gap: 0;
    grid-template-areas: 'header' 'results';
    grid-template-columns: auto;
    margin: ${theme.size.large} ${theme.size.medium} ${theme.size.xlarge} ${theme.size.medium};
  }
`;

const StyledSearchFilters = styled(SearchFilters)`
  grid-area: filters;
  @media ${theme.screenSize.upToMedium} {
    align-items: center;
    display: none;
    flex-direction: row;
    /* Slightly reduce margins from dropdown search filters */
    > div {
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

const FilterBadgesWrapper = styled('div')`
  margin-top: ${theme.size.small};
`;

const StyledBadge = styled(Badge)`
  cursor: pointer;
  height: 26px;
  margin-right: ${theme.size.small};
`;

const MobileSearchButtonWrapper = styled('div')`
  display: none;
  margin-top: ${theme.size.default};

  @media ${theme.screenSize.upToMedium} {
    display: block;
  }
`;

const SearchResults = () => {
  const { search } = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [searchFilter, setSearchFilter] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const specifySearchText = 'Specify your search';

  const resetFilters = useCallback(() => {
    setSelectedProduct(null);
    // Reset branch and search filter since they require a product
    setSelectedBranch(null);
    setSearchFilter(null);
  }, []);

  const showFilterOptions = useCallback(() => {
    setShowMobileFilters(true);
  }, []);

  let mobileFilterButton = {
    glyph: 'X',
    onClick: resetFilters,
    text: 'Clear filters',
  };
  if (!searchFilter) {
    mobileFilterButton = {
      glyph: 'Filter',
      onClick: showFilterOptions,
      text: specifySearchText,
    };
  }

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
  }, [searchFilter, searchTerm]);

  return (
    <SearchContext.Provider
      value={{
        searchFilter,
        searchTerm,
        selectedBranch,
        selectedProduct,
        setSearchFilter,
        setSelectedBranch,
        setSelectedProduct,
        setShowMobileFilters,
      }}
    >
      <Helmet>
        <title>Search Results</title>
      </Helmet>
      {searchResults && searchResults.length ? (
        <SearchResultsContainer>
          <HeaderContainer>
            <HeaderText>Search results for "{searchTerm}"</HeaderText>
            {!!searchFilter && (
              <FilterBadgesWrapper>
                {selectedProduct && (
                  <StyledBadge variant="green" onClick={resetFilters}>
                    {selectedProduct}
                    <Icon glyph="X" />
                  </StyledBadge>
                )}
                {selectedBranch && <StyledBadge variant="blue">{selectedBranch}</StyledBadge>}
              </FilterBadgesWrapper>
            )}
            <MobileSearchButtonWrapper>
              <Button leftGlyph={<Icon glyph={mobileFilterButton.glyph} />} onClick={mobileFilterButton.onClick}>
                {mobileFilterButton.text}
              </Button>
            </MobileSearchButtonWrapper>
          </HeaderContainer>
          <StyledSearchResults>
            {searchResults.map(({ title, preview, url }, index) => (
              <StyledSearchResult
                key={`${url}${index}`}
                onClick={() =>
                  reportAnalytics('SearchSelection', { areaFrom: 'ResultsPage', rank: index, selectionUrl: url })
                }
                title={title}
                preview={preview}
                url={transformUrlBasedOnOrigin(url)}
                useLargeTitle
              />
            ))}
          </StyledSearchResults>
          <FiltersContainer>
            <FilterHeader>{specifySearchText}</FilterHeader>
            <StyledSearchFilters hasSideLabels={false} />
          </FiltersContainer>
          {showMobileFilters && <MobileFilters />}
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
