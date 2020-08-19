import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import CondensedSearchbar from './CondensedSearchbar';
import ExpandedSearchbar, { MagnifyingGlass } from './ExpandedSearchbar';
import SearchContext from './SearchContext';
import { activeTextBarStyling, StyledTextInput } from './SearchTextInput';
import { useClickOutside } from '../../hooks/use-click-outside';
import { theme } from '../../theme/docsTheme';
import { reportAnalytics } from '../../utils/report-analytics';
import SearchDropdown from './SearchDropdown';

const BUTTON_SIZE = theme.size.medium;
const NUMBER_SEARCH_RESULTS = 9;
const SEARCH_DELAY_TIME = 200;
const SEARCHBAR_DESKTOP_WIDTH = '372px';
const SEARCHBAR_HEIGHT = '36px';
const SEARCHBAR_HEIGHT_OFFSET = '5px';
const TRANSITION_SPEED = '150ms';

const SearchbarContainer = styled('div')`
  height: ${SEARCHBAR_HEIGHT};
  position: fixed;
  right: ${theme.size.default};
  top: ${SEARCHBAR_HEIGHT_OFFSET};
  transition: width ${TRANSITION_SPEED} ease-in;
  width: ${({ isExpanded }) => (isExpanded ? SEARCHBAR_DESKTOP_WIDTH : BUTTON_SIZE)};
  /* docs-tools navbar z-index is 9999 */
  z-index: 10000;
  :hover,
  :focus,
  :focus-within {
    ${MagnifyingGlass} {
      color: ${uiColors.gray.dark3};
    }
    ${StyledTextInput} {
      div > input {
        ${activeTextBarStyling}
        box-shadow: 0 0 ${theme.size.tiny} 0 rgba(184, 196, 194, 0.56);
        transition: background-color ${TRANSITION_SPEED} ease-in, color ${TRANSITION_SPEED} ease-in;
        @media ${theme.screenSize.upToSmall} {
          box-shadow: none;
        }
      }
    }
  }
  @media ${theme.screenSize.upToSmall} {
    height: ${({ isExpanded, isSearching }) => (isExpanded && isSearching ? '100%' : SEARCHBAR_HEIGHT)};
    left: 0;
    top: ${SEARCHBAR_HEIGHT_OFFSET};
    width: 100%;
  }
`;

const Searchbar = ({ getResultsFromJSON, isExpanded, setIsExpanded, searchParamsToURL, shouldAutofocus }) => {
  const [value, setValue] = useState(false);
  const [searchFilter, setSearchFilter] = useState(null);
  // Use a second search filter state var to track filters but not make any calls yet
  const [draftSearchFilter, setDraftSearchFilter] = useState(null);
  const [searchEvent, setSearchEvent] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef(null);
  // A user is searching if the text input is focused and it is not empty
  const isSearching = useMemo(() => !!value && isFocused, [isFocused, value]);
  // Callback to "promote" an in-progress search filter to kick off a search
  const onApplyFilters = useCallback(() => setSearchFilter(draftSearchFilter), [draftSearchFilter]);

  // Focus Handlers
  const onExpand = useCallback(() => setIsExpanded(true), [setIsExpanded]);
  const onFocus = useCallback(() => {
    if (!isFocused) {
      reportAnalytics('SearchFocus', {});
    }
    setIsFocused(true);
  }, [isFocused]);
  // Remove focus and close searchbar if it disrupts the navbar
  const onBlur = useCallback(() => {
    // Since this is tied to a document click off event, we want to be sure this is
    // really a blur and not just clicking outside of the searchbar
    if (isFocused) {
      reportAnalytics('SearchBlur', { query: value });
    }
    setIsFocused(false);
    // The parent controls whether a searchbar is expanded by default, so this may
    // have no effect where the searchbar should always be open
    setIsExpanded(false);
  }, [isFocused, setIsExpanded, value]);
  // Close the dropdown and remove focus when clicked outside
  useClickOutside(searchContainerRef, onBlur);
  const onClose = useCallback(() => setIsExpanded(false), [setIsExpanded]);

  const onSearchChange = useCallback(
    searchTerm => {
      setIsFocused(true);
      // Debounce any queued search event since the query has changed
      clearTimeout(searchEvent);
      setValue(searchTerm);
      // The below useEffect will then run to query a new search since `value` was updated
    },
    [searchEvent]
  );

  // Update state on a new search query or filters
  const fetchNewSearchResults = useCallback(async () => {
    reportAnalytics('SearchQuery', { query: value });
    const result = await fetch(searchParamsToURL(value, searchFilter));
    const resultJson = await result.json();
    setSearchResults(getResultsFromJSON(resultJson, NUMBER_SEARCH_RESULTS));
  }, [getResultsFromJSON, searchFilter, searchParamsToURL, value]);

  useEffect(() => {
    if (value) {
      // Set a timeout to trigger the search to avoid over-requesting
      setSearchEvent(setTimeout(fetchNewSearchResults, SEARCH_DELAY_TIME));
    }
  }, [fetchNewSearchResults, value]);

  return (
    <SearchbarContainer isSearching={isSearching} isExpanded={isExpanded} onFocus={onFocus} ref={searchContainerRef}>
      {isExpanded ? (
        <SearchContext.Provider
          value={{
            searchContainerRef,
            searchFilter: draftSearchFilter,
            setSearchFilter: setDraftSearchFilter,
            searchTerm: value,
            shouldAutofocus,
          }}
        >
          <ExpandedSearchbar onMobileClose={onClose} onChange={onSearchChange} value={value} />
          {isSearching && <SearchDropdown applySearchFilter={onApplyFilters} results={searchResults} />}
        </SearchContext.Provider>
      ) : (
        <CondensedSearchbar onExpand={onExpand} />
      )}
    </SearchbarContainer>
  );
};

// export { SearchbarContainer };
export default Searchbar;
