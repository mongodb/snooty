import React from 'react';
import SearchResults from './SearchResults';

// Wraps the main SearchResults component with a context provider to limit scope of data
const SearchWrapper = () => {
  return <SearchResults />;
};

export default SearchWrapper;
