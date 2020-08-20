import { createContext } from 'react';

// Simple context to pass search results, ref, and filters to children
const SearchContext = createContext({
  searchContainerRef: null,
  searchFilter: null,
  searchTerm: '',
  setSearchFilter: null,
  shouldAutofocus: false,
});

export default SearchContext;
