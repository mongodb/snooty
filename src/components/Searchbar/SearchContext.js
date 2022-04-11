import { createContext } from 'react';

// Simple context to pass search results, ref, and filters to children
const SearchContext = createContext({
  searchContainerRef: null,
  searchFilter: null,
  searchTerm: '',
  selectedBranch: null,
  selectedProduct: null,
  setSearchFilter: null,
  setSelectedBranch: () => {},
  setSelectedProduct: () => {},
  setShowMobileFilters: () => {},
  shouldAutofocus: false,
});

export default SearchContext;
