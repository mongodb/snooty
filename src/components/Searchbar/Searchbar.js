import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import CondensedSearchbar from './CondensedSearchbar';
import ExpandedSearchbar, { MagnifyingGlass } from './ExpandedSearchbar';
import SearchContext from './SearchContext';
import SearchDropdown from './SearchDropdown';
import { useClickOutside } from '../../hooks/use-click-outside';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { theme } from '../../theme/docsTheme';

const BUTTON_SIZE = theme.size.medium;
const NUMBER_SEARCH_RESULTS = 9;
const SEARCH_DELAY_TIME = 200;
const SEARCHBAR_DESKTOP_WIDTH = '372px';
const SEARCHBAR_HEIGHT = '36px';
const SEARCHBAR_HEIGHT_OFFSET = '5px';
const TRANSITION_SPEED = '150ms';

const expandedCss = css`
  position: absolute;
  right: 16px;
  top: ${SEARCHBAR_HEIGHT_OFFSET};
`;

const SearchbarContainer = styled.div(
  (props) => css`
    height: ${SEARCHBAR_HEIGHT};
    position: relative;
    transition: width ${TRANSITION_SPEED} ease-in;
    width: ${props.isExpanded ? SEARCHBAR_DESKTOP_WIDTH : BUTTON_SIZE};
    // Allows SearchDropdown to appear above the navbar but beneath the searchbar
    z-index: 1;

    :hover,
    :focus,
    :focus-within {
      ${MagnifyingGlass} {
        color: ${palette.gray.dark3};
      }
    }

    @media ${theme.screenSize.upToSmall} {
      height: ${props.isExpanded && props.isSearching ? '100%' : SEARCHBAR_HEIGHT};
      transition: unset;
      width: ${props.isExpanded ? '100%' : BUTTON_SIZE};
      ${props.isExpanded ? 'left: 0' : 'right: 0'};
    }

    // Allows the expanded searchbar to appear above other nav components on smaller screens
    @media all and (max-width: 670px) {
      ${props.isExpanded && expandedCss}
    }
  `
);

const Searchbar = ({ getResultsFromJSON, isExpanded, setIsExpanded, searchParamsToURL, shouldAutofocus }) => {
  const { project } = useSiteMetadata();
  const [value, setValue] = useState('');

  // XXX: Search filter defaults to Realm if a user is on the Realm docs
  const defaultSearchFilter = useMemo(() => (project === 'realm' ? 'realm-master' : null), [project]);
  const [searchFilter, setSearchFilter] = useState(defaultSearchFilter);
  // Use a second search filter state var to track filters but not make any calls yet
  const [draftSearchFilter, setDraftSearchFilter] = useState(defaultSearchFilter);
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
    setIsFocused(true);
  }, []);
  // Remove focus and close searchbar if it disrupts the navbar
  const onBlur = useCallback(() => {
    // Since this is tied to a document click off event, we want to be sure this is
    // really a blur and not just clicking outside of the searchbar
    setIsFocused(false);
    // The parent controls whether a searchbar is expanded by default, so this may
    // have no effect where the searchbar should always be open
    setIsExpanded(false);
  }, [setIsExpanded]);
  // Close the dropdown and remove focus when clicked outside
  useClickOutside(searchContainerRef, onBlur);
  const onClose = useCallback(() => setIsExpanded(false), [setIsExpanded]);

  const onSearchChange = useCallback(
    (searchTerm) => {
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
    <SearchbarContainer isExpanded={isExpanded} isSearching={isSearching} onFocus={onFocus} ref={searchContainerRef}>
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
          <ExpandedSearchbar onMobileClose={onClose} onChange={onSearchChange} isFocused={isFocused} value={value} />
          {isSearching && <SearchDropdown applySearchFilter={onApplyFilters} results={searchResults} />}
        </SearchContext.Provider>
      ) : (
        <CondensedSearchbar onExpand={onExpand} />
      )}
    </SearchbarContainer>
  );
};

export default Searchbar;
