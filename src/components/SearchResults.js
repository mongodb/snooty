import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import SearchResult from './Searchbar/SearchResult';
import { searchParamsToURL } from '../utils/search-params-to-url';
import { getSearchbarResultsFromJSON } from '../utils/get-searchbar-results-from-json';
import { parseMarianManifest } from '../utils/parse-marian-manifests';
import { theme } from '../theme/docsTheme';
import SearchContext from './Searchbar/SearchContext';
import SearchFilters from './Searchbar/SearchFilters';
import { useLocation } from '@reach/router';
import queryString from 'query-string';

const SEARCH_RESULT_HEIGHT = '128px';

const HeaderText = styled('p')`
  font-weight: bolder;
  font-family: Akzidenz;
  font-size: 18px;
  letter-spacing: 0.8px;
  line-height: 21px;
`;

const FilterHeader = styled('p')`
  text-transform: uppercase;
  color: #3d4f58;
  font-family: Akzidenz;
  font-size: 12px;
  font-weight: bolder;
  letter-spacing: 0.5px;
  line-height: 15px;
  white-space: nowrap;
  margin-bottom: 0;
`;

const FilterPane = styled('div')`
  display: flex;
  flex-direction: column;
  @media ${theme.screenSize.upToLarge} {
    flex-direction: row;
    align-items: center;
  }
`;

const SearchResultsContainer = styled('div')`
  display: grid;
  grid-template-columns: auto 173px;
  column-gap: 46px;
  width: 100%;
  @media ${theme.screenSize.upToLarge} {
    grid-template-columns: unset;
    display: flex;
    flex-direction: column-reverse;
  }
`;

const StyledSearchResults = styled('div')`
  box-shadow: none;
  display: grid;
  grid-template-rows: ${SEARCH_RESULT_HEIGHT};
  height: 100%;
  row-gap: 16px;
  width: 100%;
`;

const StyledSearchFilters = styled(SearchFilters)`
  @media ${theme.screenSize.upToLarge} {
    align-items: center;
    display: flex;
    flex-direction: row;
    > div:first-of-type {
      margin-top: 0;
      margin-bottom: 0;
    }
  }
`;

const StyledSearchResult = styled(SearchResult)`
  background-color: #fff;
  border-radius: ${theme.size.tiny};
  box-shadow: 0 0 ${theme.size.tiny} 0 rgba(231, 238, 236, 0.4);
  height: ${SEARCH_RESULT_HEIGHT};
  /* place-self adds both align-self and justify-self for flexbox */
  place-self: center;
  width: 100%;
  > div {
    padding: ${theme.size.medium};
  }
`;

const SearchResults = () => {
  const { search } = useLocation();
  const [searchTerm, setSearchTerm] = useState(null);
  const [searchFilter, setSearchFilter] = useState(null);
  const [searchFilterProperty, setSearchFilterProperty] = useState(null);

  useEffect(() => {
    const { q, searchProperty } = queryString.parse(search);
    if (q) {
      setSearchTerm(q);
    }
    if (searchProperty) {
      setSearchFilter(searchProperty);
    }
  }, [search]);
  const [searchResults, setSearchResults] = useState([]);

  // Update state on a new search query or filters
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

  useEffect(() => {
    if (searchFilter) {
      const { property } = parseMarianManifest(searchFilter);
      setSearchFilterProperty(property);
    }
  }, [searchFilter]);

  return (
    <SearchContext.Provider value={{ searchFilter, searchTerm, setSearchFilter }}>
      <SearchResultsContainer>
        {searchResults.length ? (
          <div>
            <HeaderText>
              {searchFilterProperty ? `${searchFilterProperty} results ` : 'All search results '} for "{searchTerm}"
            </HeaderText>
            <StyledSearchResults>
              {searchResults.map(({ title, preview, url }, index) => (
                <StyledSearchResult
                  key={`${url}${index}`}
                  // learnMoreLink={isMobile}
                  title={title}
                  preview={preview}
                  url={url}
                />
              ))}
            </StyledSearchResults>
          </div>
        ) : (
          <p>There are no search results</p>
        )}
        <FilterPane>
          <FilterHeader>Filter By</FilterHeader>
          <StyledSearchFilters hasSideLabels={false} />
        </FilterPane>
      </SearchResultsContainer>
    </SearchContext.Provider>
  );
};

export default SearchResults;
