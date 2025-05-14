import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';
import { navigate } from 'gatsby';
import { useMarianManifests } from '../../hooks/use-marian-manifests';
import { FACETS_LEVEL_KEY, FACETS_KEY_PREFIX } from '../../utils/search-facet-constants';
import useFacets from './Facets/useFacets';

const combineKeyAndId = (facet) => `${facet.key}${FACETS_LEVEL_KEY}${facet.id}`;

const constructFacetNamesByKey = (facets) => {
  const res = {};

  function extractKeyIdName(facets) {
    for (const facet of facets) {
      res[combineKeyAndId(facet)] = facet.name;
      if (facet?.facets?.length) {
        traverseFacetGroup(facet.facets);
      }
    }
  }

  function traverseFacetGroup(facetGroup) {
    for (const facet of facetGroup) {
      res[combineKeyAndId(facet)] = facet.name;
      extractKeyIdName(facet.options);
    }
  }

  traverseFacetGroup(facets);

  return res;
};

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
  clearFacets: () => {},
  shouldAutofocus: false,
  showFacets: false,
  searchParams: {},
  facets: [],
  facetNamesByKeyId: {},
  getFacetName: () => {},
});

const SearchContextProvider = ({ children, showFacets = false }) => {
  const { search, state } = useLocation();
  const { filters, searchPropertyMapping } = useMarianManifests();
  const facets = useFacets();
  const facetNamesByKeyId = useMemo(() => constructFacetNamesByKey(facets), [facets]);

  const getFacetName = useCallback(
    (facet) => {
      return facetNamesByKeyId?.[combineKeyAndId(facet)];
    },
    [facetNamesByKeyId]
  );
  // get vars from URL
  // state management for Search is within URL.
  const [searchParams, setSearchParams] = useState(() => new URLSearchParams(search));
  const page = parseInt(searchParams.get('page') || 1);
  const searchTerm = searchParams.get('q');
  const searchFilter = searchParams.get('searchProperty');

  // state vars to derive selected category and versions in dropdown
  // changes reflected in UI, not necessarily in URL
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
    setSearchParams(newSearch);
    navigate(`?${newSearch.toString()}`, { state: { preserveScroll: true } });
  };

  const handleFacetChange = useCallback(
    (facets) => {
      const newSearch = new URLSearchParams(search);

      facets.forEach(({ key, id, checked }) => {
        const paramKey = FACETS_KEY_PREFIX + key;
        if (checked) {
          // Avoid duplicate param keys with the same values
          if (!newSearch.getAll(paramKey).includes(id)) {
            newSearch.append(paramKey, id);
          }
        } else {
          newSearch.delete(FACETS_KEY_PREFIX + key, id);
        }
      });
      newSearch.set('page', 1);
      setSearchParams(newSearch);
      // The navigation might cause a small visual delay when facets are being checked
      navigate(`?${newSearch.toString()}`, { state: { preserveScroll: true } });
    },
    [search]
  );

  const clearFacets = useCallback(() => {
    const newSearch = new URLSearchParams();
    newSearch.set('q', searchTerm);
    newSearch.set('page', 1);
    navigate(`?${newSearch.toString()}`, { state: { preserveScroll: true } });
    setSearchParams(newSearch);
  }, [searchTerm]);

  useEffect(() => {
    if (state?.searchValue) {
      setSearchParams(new URLSearchParams(`?q=${state.searchValue}`));
    }
  }, [state]);

  return (
    <SearchContext.Provider
      value={{
        filters,
        page,
        setPage: (p) => {
          onSearchChange({ searchTerm: searchTerm, page: p });
        },
        searchTerm,
        setSearchTerm: (q, p = 1) => {
          onSearchChange({ searchTerm: q, page: p });
        },
        searchFilter,
        setSearchFilter: (searchProperty) => {
          onSearchChange({ searchTerm: searchTerm, searchFilter: searchProperty });
        },
        searchPropertyMapping,
        selectedCategory,
        setSelectedCategory,
        selectedVersion,
        setSelectedVersion,
        handleFacetChange,
        clearFacets,
        showMobileFilters,
        setShowMobileFilters,
        showFacets,
        searchParams,
        facets,
        facetNamesByKeyId,
        getFacetName,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;

export { SearchContextProvider };
