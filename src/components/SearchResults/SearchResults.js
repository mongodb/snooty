import { navigate } from 'gatsby';
import React, { useEffect, useState, useCallback, useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import { css, Global } from '@emotion/react';
import styled from '@emotion/styled';
import { useLocation } from '@gatsbyjs/reach-router';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import { SearchInput } from '@leafygreen-ui/search-input';
import Pagination from '@leafygreen-ui/pagination';
import { palette } from '@leafygreen-ui/palette';
import { H1 } from '@leafygreen-ui/typography';
import queryString from 'query-string';
import useScreenSize from '../../hooks/useScreenSize';
import { theme } from '../../theme/docsTheme';
import { reportAnalytics } from '../../utils/report-analytics';
import { getSearchbarResultsFromJSON } from '../../utils/get-searchbar-results-from-json';
import { escapeHtml } from '../../utils/escape-reserved-html-characters';
import { searchParamsToURL } from '../../utils/search-params-to-url';
import Tag, { searchTagStyle, searchTagStyleFeature } from '../Tag';
import SearchContext from './SearchContext';
import SearchFilters from './SearchFilters';
import SearchResult from './SearchResult';
import EmptyResults, { EMPTY_STATE_HEIGHT } from './EmptyResults';
import MobileFilters from './MobileFilters';
import 'react-loading-skeleton/dist/skeleton.css';

const DESKTOP_COLUMN_GAP = '46px';
const FILTER_COLUMN_WIDTH = '173px';
const LANDING_MODULE_MARGIN = '28px';
const LANDING_PAGE_MARGIN = '40px';
const ROW_GAP = theme.size.default;
const SKELETON_BORDER_RADIUS = '12px';
const SEARCH_RESULT_HEIGHT = '152px';
const newSearchInput = process.env.GATSBY_TEST_SEARCH_UI === 'true';

const CALC_MARGIN = `calc(50vh - ${LANDING_MODULE_MARGIN} - ${LANDING_PAGE_MARGIN} - ${EMPTY_STATE_HEIGHT} / 2)`;

const commonTextStyling = css`
  font-family: 'Euclid Circular A';
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
  color: ${palette.black} !important;
  font-size: 18px;
  line-height: 21px;
  ${commonTextStyling};
  letter-spacing: 0.8px;
`;

const FiltersContainer = styled('div')`
  grid-area: filters;
  @media ${theme.screenSize.upToMedium} {
    display: none;
  }
`;

const FilterHeader = styled('h2')`
  align-self: center;
  color: ${palette.gray.dark2};
  font-size: ${theme.fontSize.tiny};
  line-height: 15px;
  text-transform: uppercase;
  white-space: nowrap;
  ${commonTextStyling};

  // Override
  margin-bottom: ${theme.size.default};
`;

const SearchResultsContainer = styled('div')`
  column-gap: ${DESKTOP_COLUMN_GAP};
  display: grid;
  grid-template-areas: 'header .' 'results filters';
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

const searchResultStyling = css`
  ${newSearchInput
    ? `
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.1);
    border-radius: 45px;
    `
    : `box-shadow: 0 0 ${theme.size.tiny} 0 rgba(231, 238, 236, 0.4);`}
  background-color: #fff;
  height: ${SEARCH_RESULT_HEIGHT};
  position: relative;
  /* place-self adds both align-self and justify-self for flexbox */
  place-self: center;
  width: 100%;
  > div {
    ${newSearchInput ? `padding: 20px; padding-left: 30px;` : `padding: ${theme.size.medium};`}
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

const StyledSearchResult = styled(SearchResult)`
  ${searchResultStyling}
`;

const StyledLoadingSkeletonContainer = styled('div')`
  ${searchResultStyling}
  box-shadow: 0 0 ${theme.size.tiny} 0 rgba(231, 238, 236, 1) !important;
  color: red;

  /* inner div padding */
  box-sizing: border-box;
  padding: 15px;

  * {
    padding: 2px;
    height: 15px !important;
    margin-right: 10px !important;
  }

  /* grid to handle loading skeleton structure */
  display: grid;
  grid-template-rows: 1fr 2fr 1fr;
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
      ${!newSearchInput && `opacity: 0.2; transition: opacity 150ms ease-in;`}

      :hover {
        opacity: 1;
        ${newSearchInput && `box-shadow: 0px 0px 5px 1px rgba(58, 63, 60, 0.15);`}
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

const EmptyPlaceholder = styled('div')`
  height: 1000px;
  width: 100%;
`;

const FilterBadgesWrapper = styled('div')`
  margin-top: ${theme.size.small};
`;

const StyledTag = styled(Tag)`
  ${newSearchInput ? searchTagStyleFeature : searchTagStyle}
`;

const ResultTag = styled('div')`
  display: flex;
  flex-direction: row;
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

  const {
    page,
    searchTerm,
    searchFilter,
    setSearchFilter,
    selectedCategory,
    selectedVersion,
    searchPropertyMapping,
    showMobileFilters,
    setShowMobileFilters,
  } = useContext(SearchContext);

  const { isTabletOrMobile } = useScreenSize();
  const [searchResults, setSearchResults] = useState([]);
  const [searchField, setSearchField] = useState(searchTerm || '');
  const [searchFinished, setSearchFinished] = useState(false);
  const [firstRenderComplete] = useState(false);
  const [firstLoadEmpty] = useState(false);
  const specifySearchText = 'Specify your search';

  const resetFilters = useCallback(() => {
    setSearchFilter(null);
  }, [setSearchFilter]);

  const showFilterOptions = useCallback(() => {
    setShowMobileFilters(true);
  }, [setShowMobileFilters]);

  let mobileFilterButton = {
    glyph: 'X',
    onClick: resetFilters,
    text: 'Clear all filters',
  };
  if (!searchFilter) {
    mobileFilterButton = {
      glyph: 'Filter',
      onClick: showFilterOptions,
      text: specifySearchText,
    };
  }

  // async call to fetch search results
  // effect is called if searchTerm, searchPropertyMapping are defined
  useEffect(() => {
    if (!searchTerm || !searchPropertyMapping || !Object.keys(searchPropertyMapping).length) {
      return;
    }
    setSearchFinished(false);

    const fetchSearchResults = async () => {
      const res = await fetch(searchParamsToURL(searchTerm, searchFilter, page));
      return (await res.json()).results;
    };

    const fetchDeprecatedSearchResults = async () => {
      const result = await fetch(searchParamsToURL(searchTerm, searchFilter));
      const resultJson = await result.json();
      if (!!resultJson?.results) {
        return getSearchbarResultsFromJSON(resultJson, searchPropertyMapping);
      }
    };

    const request = newSearchInput ? fetchSearchResults : fetchDeprecatedSearchResults;

    request()
      .then(setSearchResults)
      .catch((e) => {
        console.error(`Error fetching search results: ${e}`);
      })
      .finally(() => {
        setSearchFinished(true);
      });
  }, [searchTerm, page, searchFilter, searchPropertyMapping]);

  const submitNewSearch = (event) => {
    const newValue = event.target[0]?.value;
    const { page } = queryString.parse(search);
    if (newValue === searchTerm && parseInt(page) === 1) return;
    const searchParams = new URLSearchParams(search);
    searchParams.set('q', newValue);
    searchParams.set('page', '1');
    const queryPath = '?' + searchParams.toString();
    navigate(queryPath);
  };

  const onPageClick = useCallback(
    async (isForward) => {
      const searchParams = new URLSearchParams(search);
      const currentPage = parseInt(searchParams.get('page'));
      const newPage = isForward ? currentPage + 1 : currentPage - 1;
      if (newPage < 1) {
        return;
      }
      searchParams.set('page', newPage);
      const queryPath = '?' + searchParams.toString();
      navigate(queryPath);
      setSearchFinished(false);
      const result = await fetch(searchParamsToURL(searchTerm, searchFilter, newPage));
      const resJson = await result.json();
      setSearchResults(resJson?.results || []);
      setSearchFinished(true);
    },
    [search, searchFilter, searchTerm]
  );

  return (
    <>
      <Global
        styles={css`
          body {
            ${newSearchInput ? `background-color: #ffffff !important;` : ` background-color: #f9fbfa !important;`}
          }
        `}
      />
      {newSearchInput && (
        <SearchResultsContainer>
          {/* new header for search bar */}
          <HeaderContainer>
            <H1 style={{ color: '#00684A', paddingBottom: '40px' }}> Search Results</H1>
            <SearchInput
              value={searchField}
              placeholder="Search"
              onSubmit={submitNewSearch}
              onChange={(e) => {
                setSearchField(e.target.value);
              }}
            />
            <ResultTag style={{ paddingTop: '10px' }}>
              {/* TODO: add number of results from metadata */}
              {/* <Overline style={{ paddingTop: '11px', paddingRight: '8px' }}>
                  {!firstLoadEmpty && <>{searchResults?.length ? searchResults.length : '0'} RESULTS</>}
                </Overline> */}
              {!!searchFilter && (
                <FilterBadgesWrapper>
                  {selectedCategory && (
                    <StyledTag variant="green" onClick={resetFilters}>
                      {selectedCategory}
                      <Icon style={{ marginLeft: '8px', marginRight: '-2px' }} glyph="X" />
                    </StyledTag>
                  )}
                  {selectedVersion && <StyledTag variant="blue">{selectedVersion}</StyledTag>}
                </FilterBadgesWrapper>
              )}
            </ResultTag>
            <MobileSearchButtonWrapper>
              <Button leftGlyph={<Icon glyph={mobileFilterButton.glyph} />} onClick={mobileFilterButton.onClick}>
                {mobileFilterButton.text}
              </Button>
            </MobileSearchButtonWrapper>
          </HeaderContainer>

          {/* loading state for new search input */}
          {!!searchTerm && !searchFinished && (
            <>
              <StyledSearchResults>
                {[...Array(10)].map((_, index) => (
                  <StyledLoadingSkeletonContainer key={index}>
                    <Skeleton borderRadius={SKELETON_BORDER_RADIUS} width={200} />
                    <Skeleton borderRadius={SKELETON_BORDER_RADIUS} />
                    <Skeleton count={2} borderRadius={SKELETON_BORDER_RADIUS} inline width={60} />
                  </StyledLoadingSkeletonContainer>
                ))}
              </StyledSearchResults>
            </>
          )}

          {/* empty search results */}
          {!!searchFinished && !searchResults.length && (
            <>
              {firstLoadEmpty ? (
                <FiltersContainer
                  css={css`
                    margin-bottom: 550px;
                  `}
                />
              ) : (
                <>
                  <EmptyResultsContainer
                    css={css`
                      grid-area: results;
                      margin-top: 80px;
                    `}
                  >
                    <EmptyResults />
                  </EmptyResultsContainer>
                </>
              )}
            </>
          )}

          {/* search results for new search page */}
          {!!searchTerm && !!searchFinished && !!searchResults.length && (
            <>
              <StyledSearchResults>
                {searchResults.map(({ title, preview, url, searchProperty }, index) => (
                  <StyledSearchResult
                    key={`${url}${index}`}
                    onClick={() =>
                      reportAnalytics('SearchSelection', { areaFrom: 'ResultsPage', rank: index, selectionUrl: url })
                    }
                    title={title}
                    preview={escapeHtml(preview)}
                    url={url}
                    useLargeTitle
                    searchProperty={searchProperty?.[0]}
                  />
                ))}
                {
                  <>
                    <Pagination
                      currentPage={parseInt(new URLSearchParams(search).get('page'))}
                      // TODO: add count after facet meta query
                      onForwardArrowClick={onPageClick.bind(null, true)}
                      onBackArrowClick={onPageClick.bind(null, false)}
                      shouldDisableBackArrow={parseInt(new URLSearchParams(search).get('page')) === 1}
                      // TODO: should disable if at max count from meta query
                      shouldDisableForwardArrow={searchResults?.length && searchResults.length < 10}
                    ></Pagination>
                  </>
                }
              </StyledSearchResults>
            </>
          )}
          {!firstLoadEmpty && (
            <FiltersContainer>
              <FilterHeader>{specifySearchText}</FilterHeader>
              <StyledSearchFilters />
            </FiltersContainer>
          )}
          {showMobileFilters && isTabletOrMobile && <MobileFilters />}
        </SearchResultsContainer>
      )}

      {/* old search page */}
      {!newSearchInput && !searchTerm && (
        <>
          {!searchResults?.length && (
            <EmptyResultsContainer>
              {firstRenderComplete ? <EmptyResults type={'searchLandingPage'} /> : <EmptyPlaceholder />}
            </EmptyResultsContainer>
          )}
        </>
      )}
      {!newSearchInput && !!searchTerm && (
        <SearchResultsContainer>
          <HeaderContainer>
            <HeaderText>Search results for "{searchTerm}"</HeaderText>
            {!!searchFilter && (
              <FilterBadgesWrapper>
                {selectedCategory && (
                  <StyledTag variant="green" onClick={resetFilters}>
                    {selectedCategory}
                    <Icon glyph="X" />
                  </StyledTag>
                )}
                {selectedVersion && <StyledTag variant="blue">{selectedVersion}</StyledTag>}
              </FilterBadgesWrapper>
            )}
            <MobileSearchButtonWrapper>
              <Button leftGlyph={<Icon glyph={mobileFilterButton.glyph} />} onClick={mobileFilterButton.onClick}>
                {mobileFilterButton.text}
              </Button>
            </MobileSearchButtonWrapper>
          </HeaderContainer>
          {searchResults?.length && searchFinished ? (
            <>
              <StyledSearchResults>
                {searchResults.map(({ title, preview, url, searchProperty }, index) => (
                  <StyledSearchResult
                    key={`${url}${index}`}
                    onClick={() =>
                      reportAnalytics('SearchSelection', { areaFrom: 'ResultsPage', rank: index, selectionUrl: url })
                    }
                    title={title}
                    preview={escapeHtml(preview)}
                    url={url}
                    useLargeTitle
                    searchProperty={searchProperty?.[0]}
                  />
                ))}
              </StyledSearchResults>
              <FiltersContainer>
                <FilterHeader>{specifySearchText}</FilterHeader>
                <StyledSearchFilters />
              </FiltersContainer>
            </>
          ) : (
            <>
              {!searchFinished ? (
                <>
                  <StyledSearchResults>
                    {[...Array(10)].map((_, index) => (
                      <StyledLoadingSkeletonContainer key={index}>
                        <Skeleton borderRadius={SKELETON_BORDER_RADIUS} width={200} />
                        <Skeleton borderRadius={SKELETON_BORDER_RADIUS} />
                        <Skeleton count={2} borderRadius={SKELETON_BORDER_RADIUS} inline width={60} />
                      </StyledLoadingSkeletonContainer>
                    ))}
                  </StyledSearchResults>
                  <FiltersContainer>
                    <FilterHeader>{specifySearchText}</FilterHeader>
                    <Skeleton count={2} borderRadius={SKELETON_BORDER_RADIUS} width={200} />
                  </FiltersContainer>
                </>
              ) : (
                <>
                  <EmptyResultsContainer
                    css={css`
                      grid-area: results;
                      margin-top: 80px;
                    `}
                  >
                    <EmptyResults />
                  </EmptyResultsContainer>
                  <FiltersContainer>
                    <FilterHeader>{specifySearchText}</FilterHeader>
                    <StyledSearchFilters />
                  </FiltersContainer>
                </>
              )}
            </>
          )}
          {showMobileFilters && isTabletOrMobile && <MobileFilters />}
        </SearchResultsContainer>
      )}
    </>
  );
};

export default SearchResults;
