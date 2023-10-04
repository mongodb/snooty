import { createContext, useCallback, useState } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';
import { navigate } from 'gatsby';
import { useMarianManifests } from '../../hooks/use-marian-manifests';

const FACETS_KEY_PREFIX = 'facets.';

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
  handleFacetChange: () => {},
  shouldAutofocus: false,
  showFacets: false,
  searchParams: {},
});

const SearchContextProvider = ({ children, showFacets = false }) => {
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Facets are applied on toggle, in the format facet-option>facet-value

  // navigate changes and store state in URL
  const onSearchChange = ({ searchTerm, searchFilter, page }) => {
    const newSearch = new URLSearchParams(search);
    if (searchTerm) {
      newSearch.set('q', searchTerm);
    }
    if (searchFilter !== undefined) {
      // searchFilter can be null
      if (searchFilter === null) {
        newSearch.delete('searchProperty');
      } else {
        newSearch.set('searchProperty', searchFilter);
      }
      newSearch.set('page', 1);
    }
    if (page) {
      newSearch.set('page', page);
    }
    navigate(`?${newSearch.toString()}`);
  };

  const handleFacetChange = useCallback(
    ({ target, key, id }) => {
      const { id: fullFacetId, checked } = target;

      // Update query params based on whether a facet a is being added or removed
      const updateFacetSearchParams = (facets, action) => {
        const newSearch = new URLSearchParams(search);

        if (action === 'add') {
          facets.forEach(({ key, id }) => {
            newSearch.append(`${FACETS_KEY_PREFIX}${key}`, id);
          });
        } else if (action === 'remove') {
          facets.forEach(({ key, id }) => {
            newSearch.delete(`${FACETS_KEY_PREFIX}${key}`, id);
          });
        }

        // The navigation might cause a small visual delay when facets are being checked
        navigate(`?${newSearch.toString()}`);
      };

      const newFacet = { fullFacetId, key, id };
      if (checked) {
        updateFacetSearchParams([newFacet], 'add');
      } else {
        const facetsToRemove = [newFacet];
        // Remove facet from array, including any sub-facet with same relationship
        updateFacetSearchParams(facetsToRemove, 'remove');
      }
    },
    [search]
  );

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
        handleFacetChange,
        showMobileFilters,
        setShowMobileFilters,
        showFacets,
        searchParams,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;

export { SearchContextProvider };
