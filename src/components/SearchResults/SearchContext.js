import { createContext, useEffect, useState } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';
import { navigate } from 'gatsby';
import { useMarianManifests } from '../../hooks/use-marian-manifests';

// Simple context to pass search results, ref, and filters to children
const SearchContext = createContext({
  filters: {},
  page: 1,
  searchFilter: null,
  searchPropertyMapping: {},
  searchTerm: '',
  selectedVersion: null,
  selectedCategory: null,
  setSearchFilter: null,
  setSelectedVersion: () => {},
  setSelectedCategory: () => {},
  setShowMobileFilters: () => {},
  shouldAutofocus: false,
});

const SearchContextProvider = ({ children }) => {
  const { search } = useLocation();
  const { filters, searchPropertyMapping } = useMarianManifests();
  // get vars from URL
  // state management for Search is within URL.
  const searchParams = new URLSearchParams(search);
  const page = parseInt(searchParams.get('page') || 1);
  const searchTerm = searchParams.get('q');
  const searchFilter = searchParams.get('searchProperty');

  // state vars to derive selected category and versions in dropdown
  // changes reflected in UI, not necessarily in URL

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);

  // navigate changes and store state in URL
  const onSearchChange = ({ searchTerm, searchFilter, page }) => {
    const newSearch = new URLSearchParams(search);
    if (searchTerm) {
      newSearch.set('q', searchTerm);
    }
    if (searchFilter !== undefined) {
      // searchFilter can be null
      newSearch.set('searchProperty', searchFilter);
      newSearch.set('page', 1);
    }
    if (page) {
      newSearch.set('page', page);
    }
    navigate(`?${newSearch.toString()}`);
  };

  // when filters are loaded, validate searchFilter from URL
  // against available searchPropertyMapping
  useEffect(() => {
    if (filters && searchFilter) {
      const currentFilter = searchPropertyMapping[searchFilter];
      if (!currentFilter) {
        setSelectedCategory(null);
        setSelectedVersion(null);
        return;
      }

      const { categoryTitle, versionSelectorLabel } = currentFilter;
      setSelectedCategory(categoryTitle);
      setSelectedVersion(versionSelectorLabel);
    }
  }, [filters, searchFilter, searchPropertyMapping]);

  return (
    <SearchContext.Provider
      value={{
        filters,
        page,
        setPage: (p) => {
          onSearchChange({ page: p });
        },
        searchTerm,
        setSearchTerm: (q) => {
          onSearchChange({ searchTerm: q });
        },
        searchFilter,
        setSearchFilter: (searchProperty) => {
          onSearchChange({ searchFilter: searchProperty });
        },
        searchPropertyMapping,
        selectedCategory,
        setSelectedCategory,
        selectedVersion,
        setSelectedVersion,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;

export { SearchContextProvider };
