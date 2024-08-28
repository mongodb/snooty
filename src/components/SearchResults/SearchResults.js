import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import styled from '@emotion/styled';
import { useLocation } from '@gatsbyjs/reach-router';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import { SearchInput } from '@leafygreen-ui/search-input';
import Pagination from '@leafygreen-ui/pagination';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { H3, Overline } from '@leafygreen-ui/typography';
import queryString from 'query-string';
import { ParagraphSkeleton } from '@leafygreen-ui/skeleton-loader';
import useScreenSize from '../../hooks/useScreenSize';
import { theme } from '../../theme/docsTheme';
import { reportAnalytics } from '../../utils/report-analytics';
import { escapeHtml } from '../../utils/escape-reserved-html-characters';
import { searchParamsToMetaURL, searchParamsToURL } from '../../utils/search-params-to-url';
import { requestHeaders } from '../../utils/search-facet-constants';
import Tag, { searchTagStyle } from '../Tag';
import SearchContext from './SearchContext';
import SearchFilters from './SearchFilters';
import SearchResult from './SearchResult';
import EmptyResults, { EMPTY_STATE_HEIGHT } from './EmptyResults';
import MobileFilters from './MobileFilters';
import { Facets, FacetTags } from './Facets';
import { SEARCH_THEME_STYLES } from './styles/searchThemeStyles';

const FILTER_COLUMN_WIDTH = '173px';
const LANDING_MODULE_MARGIN = '28px';
const LANDING_PAGE_MARGIN = '40px';
const ROW_GAP = theme.size.default;
const SEARCH_RESULT_HEIGHT = '152px';

const CALC_MARGIN = `calc(50vh - ${LANDING_MODULE_MARGIN} - ${LANDING_PAGE_MARGIN} - ${EMPTY_STATE_HEIGHT} / 2)`;

const commonTextStyling = `
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
  grid-area: results;
  margin-top: 80px;
`;

const HeaderContainer = styled('div')`
  grid-area: header;
`;

const headerContainerDynamicStyles = ({ headingColor }) => css`
  > h1:first-of-type {
    color: ${headingColor};
    padding-bottom: 24px;
    margin: unset;
  }
`;

const FiltersContainer = styled('div')`
  grid-area: filters;
  @media ${theme.screenSize.upToMedium} {
    display: none;
  }
`;

const FilterHeader = styled('h2')`
  align-self: center;
  font-size: ${theme.fontSize.tiny};
  line-height: 15px;
  text-transform: uppercase;
  white-space: nowrap;
  ${commonTextStyling};

  // Override
  margin-bottom: ${theme.size.default};
`;

const filterHeaderDynamicStyles = ({ filterHeaderColor }) => css`
  color: ${filterHeaderColor};
`;

const SearchResultsContainer = styled('div')`
  display: grid;
  ${({ showFacets }) =>
    showFacets
      ? `
    column-gap: 16px;
    grid-template-areas: 'header header' 'filters results';
    grid-template-columns: 188px auto;

    @media ${theme.screenSize.upTo2XLarge} {
      margin: ${theme.size.large} 71px ${theme.size.xlarge} 52px;
    }
  `
      : `
    column-gap: 46px;
    grid-template-areas: 'header .' 'results filters';
    grid-template-columns: auto ${FILTER_COLUMN_WIDTH};

    @media ${theme.screenSize.upTo2XLarge} {
      margin: ${theme.size.large} 40px ${theme.size.xlarge} 40px;
    }
  `}
  margin: ${theme.size.large} 108px ${theme.size.xlarge} ${theme.size.large};
  max-width: 1150px;
  row-gap: ${theme.size.large};

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

const searchResultStyling = `
  border-radius: 45px;
  height: ${SEARCH_RESULT_HEIGHT};
  position: relative;
  /* place-self adds both align-self and justify-self for flexbox */
  place-self: center;
  width: 100%;
  > div {
    padding: 20px;
    padding-left: 30px;
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

export const searchResultDynamicStyling = ({ boxShadow, boxShadowOnHover }) => css`
  box-shadow: ${boxShadow};

  :hover {
    opacity: 1;
    box-shadow: ${boxShadowOnHover};
  }
`;

const StyledSearchResult = styled(SearchResult)`
  ${searchResultStyling}
`;

const StyledLoadingSkeletonContainer = styled('div')`
  ${searchResultStyling}
  box-shadow: 0 0 ${theme.size.tiny} 0 rgba(231, 238, 236, 1) !important;

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
  :not(:hover) {
    > ${StyledSearchResult} {
      opacity: 1;
      transition: opacity 150ms ease-in;
    }
  }
`;

const StyledTag = styled(Tag)`
  ${searchTagStyle}
`;

const ResultTag = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  row-gap: ${theme.size.small};
  padding-top: ${theme.size.default};
  align-items: center;
`;

const overlineStyle = css`
  padding-right: 8px;
`;

const iconStyle = css`
  margin-left: 8px;
  margin-right: -2px;
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
    searchTerm,
    searchFilter,
    setSearchFilter,
    selectedCategory,
    selectedVersion,
    showMobileFilters,
    setShowMobileFilters,
    showFacets,
    searchParams,
    setSearchTerm,
  } = useContext(SearchContext);

  const { isTabletOrMobile } = useScreenSize();
  const [searchResults, setSearchResults] = useState([]);
  const [searchField, setSearchField] = useState(searchTerm || '');

  const [searchFinished, setSearchFinished] = useState(() => !searchTerm);
  const [searchCount, setSearchCount] = useState();
  const [searchResultFacets, setSearchResultFacets] = useState([]);

  const specifySearchText = 'Refine your search';
  const searchBoxRef = useRef(null);

  const { theme: siteTheme } = useDarkMode();

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

  // effect called to autofocus search box on page render
  useEffect(() => {
    if (searchBoxRef.current) {
      searchBoxRef.current.focus();
      // Add class for Smartling localization
      searchBoxRef.current.classList.add('sl-search-input');
    }
  }, []);

  // async call to fetch search results
  // effect is called if searchTerm, searchPropertyMapping are defined
  useEffect(() => {
    if (!searchParams.get('q')) {
      setSearchResults([]);
      return;
    }
    setSearchFinished(false);

    const fetchSearchResults = async () => {
      const res = await fetch(searchParamsToURL(searchParams), requestHeaders);
      return (await res.json()).results;
    };

    const fetchSearchMeta = async () => {
      const res = await fetch(searchParamsToMetaURL(searchParams), requestHeaders);
      return res.json();
    };

    // fetch search results
    fetchSearchResults()
      .then((searchRes) => {
        setSearchResults(searchRes || []);
      })
      .catch((e) => {
        console.error(`Error fetching search results: ${JSON.stringify(e)}`);
      })
      .finally(() => {
        setSearchFinished(true);
      });

    // fetch search meta (count)
    fetchSearchMeta()
      .then((res) => {
        setSearchCount(res?.count);
      })
      .catch((e) => {
        console.error(`Error while fetching search meta: ${JSON.stringify(e)}`);
        setSearchCount();
      });
  }, [searchParams]);

  // update filters only on search term change
  useEffect(() => {
    const fetchSearchMeta = async () => {
      const res = await fetch(searchParamsToMetaURL(null, searchTerm), requestHeaders);
      return res.json();
    };

    fetchSearchMeta()
      .then((res) => {
        setSearchResultFacets(res?.facets);
      })
      .catch((e) => {
        console.error(`Error while fetching search meta: ${JSON.stringify(e)}`);
        setSearchResultFacets([]);
      });
  }, [searchTerm]);

  const submitNewSearch = (event) => {
    const newValue = event.target[0]?.value;
    const { page } = queryString.parse(search);
    if (!newValue || (newValue === searchTerm && parseInt(page) === 1)) return;

    setSearchTerm(newValue);
  };

  const onPageClick = useCallback(
    async (isForward) => {
      const currentPage = parseInt(searchParams.get('page')) || 1;
      const newPage = isForward ? currentPage + 1 : currentPage - 1;
      if (newPage < 1) {
        return;
      }
      setSearchTerm(searchTerm, newPage);
    },
    [searchParams, searchTerm, setSearchTerm]
  );

  return (
    <SearchResultsContainer showFacets={showFacets}>
      <HeaderContainer className={cx(headerContainerDynamicStyles(SEARCH_THEME_STYLES[siteTheme]))}>
        <H3 as="h1">Search Results</H3>
        <SearchInput
          ref={searchBoxRef}
          value={searchField}
          placeholder="Search"
          onSubmit={submitNewSearch}
          onChange={(e) => {
            setSearchField(e.target.value);
          }}
        />
        {/* Classname-attached searchTerm needed for Smartling localization */}
        <span style={{ display: 'none' }} className="sl-search-keyword">
          {searchTerm}
        </span>
        {searchTerm && (
          <ResultTag>
            {!showFacets && Number.isInteger(searchCount) && (
              <Overline className={cx(overlineStyle)}>
                <>{searchCount} RESULTS</>
              </Overline>
            )}
            {!!searchFilter && (
              <div>
                {selectedCategory && (
                  <StyledTag variant="green" onClick={resetFilters}>
                    {selectedCategory}
                    <Icon className={cx(iconStyle)} glyph="X" />
                  </StyledTag>
                )}
                {selectedVersion && <StyledTag variant="blue">{selectedVersion}</StyledTag>}
              </div>
            )}
            {showFacets && <FacetTags resultsCount={searchCount}></FacetTags>}
          </ResultTag>
        )}
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
              <StyledLoadingSkeletonContainer
                key={index}
                className={cx(searchResultDynamicStyling(SEARCH_THEME_STYLES[siteTheme]))}
              >
                <ParagraphSkeleton withHeader />
              </StyledLoadingSkeletonContainer>
            ))}
          </StyledSearchResults>
        </>
      )}

      {/* empty search results */}
      {searchTerm && searchFinished && !searchResults?.length && (
        <>
          <>
            <EmptyResultsContainer>
              <EmptyResults />
            </EmptyResultsContainer>
          </>
        </>
      )}

      {/* search results for new search page */}
      {!!searchTerm && !!searchFinished && !!searchResults.length && (
        <>
          <StyledSearchResults>
            {searchResults.map(({ title, preview, url, searchProperty, facets }, index) => (
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
                facets={facets}
              />
            ))}
            {
              <>
                <Pagination
                  currentPage={parseInt(new URLSearchParams(search).get('page') || 1)}
                  numTotalItems={searchCount}
                  onForwardArrowClick={onPageClick.bind(null, true)}
                  onBackArrowClick={onPageClick.bind(null, false)}
                  shouldDisableBackArrow={parseInt(new URLSearchParams(search).get('page')) === 1}
                  shouldDisableForwardArrow={searchResults?.length && searchResults.length < 10}
                ></Pagination>
              </>
            }
          </StyledSearchResults>
        </>
      )}

      {searchParams.get('q') && (
        <FiltersContainer>
          {showFacets ? (
            <>
              {/* Avoid showing Facets component to avoid clashing values with mobile filter */}
              {!showMobileFilters && <Facets facets={searchResultFacets} />}
            </>
          ) : (
            <>
              <FilterHeader className={cx(filterHeaderDynamicStyles(SEARCH_THEME_STYLES[siteTheme]))}>
                {specifySearchText}
              </FilterHeader>
              <StyledSearchFilters />
            </>
          )}
        </FiltersContainer>
      )}
      {showMobileFilters && isTabletOrMobile && <MobileFilters facets={searchResultFacets} />}
    </SearchResultsContainer>
  );
};

export default SearchResults;
