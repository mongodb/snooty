import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';
import { navigate } from 'gatsby';
import { MarianFilters, SearchPropertyMapping, useMarianManifests } from '../../hooks/use-marian-manifests';
import { FACETS_LEVEL_KEY, FACETS_KEY_PREFIX } from '../../utils/search-facet-constants';
import { FacetOption, FacetValue } from '../../types/data';
import useFacets from './Facets/useFacets';

const combineKeyAndId = (facet: FacetOption | FacetValue) => `${facet.key}${FACETS_LEVEL_KEY}${facet.id}`;

type FacetNameByKey = Record<string, string>;

const constructFacetNamesByKey = (facets: Array<FacetOption>): FacetNameByKey => {
  const res: FacetNameByKey = {};

  function extractKeyIdName(facets: FacetValue[]) {
    for (const facet of facets) {
      res[combineKeyAndId(facet)] = facet.name;
      if (facet?.facets?.length) {
        traverseFacetGroup(facet.facets);
      }
    }
  }

  function traverseFacetGroup(facetGroup: Array<FacetOption>) {
    for (const facet of facetGroup) {
      res[combineKeyAndId(facet)] = facet.name;
      extractKeyIdName(facet.options);
    }
  }

  traverseFacetGroup(facets);

  return res;
};

type SearchContextType = {
  filters: MarianFilters;
  page: number;
  searchFilter: string | null;
  searchPropertyMapping: SearchPropertyMapping;
  searchTerm: string | null;
  selectedVersion: string | null;
  selectedCategory: string | null;
  showMobileFilters: boolean;
  setSearchFilter: (searchProperty?: string | null) => void;
  setSelectedVersion: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
  setShowMobileFilters: React.Dispatch<React.SetStateAction<boolean>>;
  handleFacetChange: (facets: Array<FacetValue>) => void;
  clearFacets: () => void;
  showFacets: boolean;
  searchParams: URLSearchParams;
  facets: Array<FacetOption>;
  facetNamesByKeyId: FacetNameByKey;
  getFacetName: (facet: FacetOption | FacetValue) => string;
  setPage: (p: string) => void;
  setSearchTerm: (q: string | null, p?: string) => void;
};

// Simple context to pass search results, ref, and filters to children
const SearchContext = createContext<SearchContextType>({
  filters: {},
  page: 1,
  searchFilter: null,
  searchPropertyMapping: {},
  searchTerm: '',
  selectedVersion: null,
  selectedCategory: null,
  showMobileFilters: false,
  setSearchFilter: () => {},
  setSelectedVersion: () => {},
  setSelectedCategory: () => {},
  setShowMobileFilters: () => {},
  handleFacetChange: () => {},
  clearFacets: () => {},
  showFacets: false,
  searchParams: new URLSearchParams(),
  facets: [],
  facetNamesByKeyId: {},
  getFacetName: () => '',
  setPage: () => {},
  setSearchTerm: () => {},
});

type LocationState = { searchValue?: string };

const SearchContextProvider = ({ children, showFacets = false }: { children: ReactNode; showFacets?: boolean }) => {
  const location = useLocation();
  const { search } = location;
  const state = location.state as LocationState | undefined;

  const { filters, searchPropertyMapping } = useMarianManifests();
  const facets = useFacets();
  const facetNamesByKeyId = useMemo(() => constructFacetNamesByKey(facets), [facets]);

  const getFacetName = useCallback(
    (facet: FacetOption | FacetValue) => {
      return facetNamesByKeyId?.[combineKeyAndId(facet)];
    },
    [facetNamesByKeyId]
  );
  // get vars from URL
  // state management for Search is within URL.
  const [searchParams, setSearchParams] = useState(() => new URLSearchParams(search));
  const page = parseInt(searchParams.get('page') || '1');
  const searchTerm = searchParams.get('q');
  const searchFilter = searchParams.get('searchProperty');

  // state vars to derive selected category and versions in dropdown
  // changes reflected in UI, not necessarily in URL
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // navigate changes and store state in URL
  const onSearchChange = ({
    searchTerm,
    searchFilter,
    page,
  }: {
    searchTerm: string | null;
    searchFilter?: string | null;
    page?: string;
  }) => {
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
      newSearch.set('page', '1');
    }
    if (page) {
      newSearch.set('page', page);
    }
    setSearchParams(newSearch);
    navigate(`?${newSearch.toString()}`, { state: { preserveScroll: true } });
  };

  const handleFacetChange = useCallback(
    (facets: Array<FacetValue>) => {
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
      newSearch.set('page', '1');
      setSearchParams(newSearch);
      // The navigation might cause a small visual delay when facets are being checked
      navigate(`?${newSearch.toString()}`, { state: { preserveScroll: true } });
    },
    [search]
  );

  const clearFacets = useCallback(() => {
    const newSearch = new URLSearchParams();
    newSearch.set('q', searchTerm ?? '');
    newSearch.set('page', '1');
    navigate(`?${newSearch.toString()}`, { state: { preserveScroll: true } });
    setSearchParams(newSearch);
  }, [searchTerm]);

  useEffect(() => {
    if (state && state?.searchValue) {
      setSearchParams(new URLSearchParams(`?q=${state.searchValue}`));
    }
  }, [state]);

  return (
    <SearchContext.Provider
      value={{
        filters,
        page,
        setPage: (p: string) => {
          onSearchChange({ searchTerm: searchTerm, page: p });
        },
        searchTerm,
        setSearchTerm: (q, p = '1') => {
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
