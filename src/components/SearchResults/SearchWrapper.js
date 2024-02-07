import React from 'react';
import { SearchContextProvider } from './SearchContext';
import SearchResults from './SearchResults';

// Check for feature flag here to make it easier to pass down for testing purposes
const SHOW_FACETS = process.env.GATSBY_FEATURE_FACETED_SEARCH === 'true';

// Wraps the main SearchResults component with a context provider to limit scope of data
const SearchWrapper = () => {
  return (
    <SearchContextProvider showFacets={SHOW_FACETS}>
      <SearchResults />
    </SearchContextProvider>
  );
};

export default SearchWrapper;
