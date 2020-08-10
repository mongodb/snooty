import { createContext } from 'react';

// Simple context to pass search results to children
const SearchContext = createContext({
  searchFilter: null,
  searchTerm: '',
  setSearchFilter: null,
  shouldAutofocus: false,
});

export default SearchContext;
