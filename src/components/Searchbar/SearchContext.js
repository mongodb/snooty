import { createContext } from 'react';

// Simple context to pass search results, ref, and filters to children
const SearchContext = createContext({
  searchContainerRef: null,
  searchFilter: null,
  searchTerm: '',
  selectedVersion: null,
  selectedCategory: null,
  setSearchFilter: null,
  setSelectedVersion: () => {},
  setSelectedCategory: () => {},
  setShowMobileFilters: () => {},
  shouldAutofocus: false,
});

export default SearchContext;
