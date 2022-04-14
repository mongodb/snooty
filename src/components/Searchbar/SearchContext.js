import { createContext } from 'react';

// Simple context to pass search results, ref, and filters to children
const SearchContext = createContext({
  searchContainerRef: null,
  searchFilter: null,
  searchTerm: '',
  selectedVersion: null,
  selectedProduct: null,
  setSearchFilter: null,
  setSelectedVersion: () => {},
  setSelectedProduct: () => {},
  setShowMobileFilters: () => {},
  shouldAutofocus: false,
});

export default SearchContext;
