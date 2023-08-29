import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import { theme } from '../../theme/docsTheme';
import Select from '../Select';
import { getSortedBranchesForProperty } from '../../utils/parse-marian-manifests';
import SearchContext from './SearchContext';

const FILTER_WIDTH = '175px';

const SelectWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme.size.default};
`;

const MaxWidthSelect = styled(Select)`
  width: ${FILTER_WIDTH};
`;

const SearchFilters = ({ manuallyApplyFilters = false, onApplyFilters, ...props }) => {
  const {
    filters,
    searchFilter,
    searchPropertyMapping,
    setSearchFilter,
    selectedCategory,
    selectedVersion,
    setSelectedVersion,
    setSelectedCategory,
  } = useContext(SearchContext);

  // Current selectedCategory and selectedVersion for dropdown. If manuallyApplyFilter === true, selectedCategory + selectedVersion
  // will not be set automatically.
  const [categoryChoices, setCategoryChoices] = useState([]);
  const [versionChoices, setVersionChoices] = useState([]);
  const [mobileCategory, setMobileCategory] = useState(null);
  const [mobileVersion, setMobileVersion] = useState(null);

  const hasOneVersion = useMemo(() => versionChoices && versionChoices.length === 1, [versionChoices]);

  const updateVersionChoices = useCallback(
    (selectedCategory, setDefaultVersion = false) => {
      if (filters && filters[selectedCategory]) {
        const versions = getSortedBranchesForProperty(filters, selectedCategory);
        if (setDefaultVersion) {
          const defaultVersion = versions[0];
          if (manuallyApplyFilters) {
            setMobileVersion(defaultVersion);
          } else {
            setSelectedVersion(defaultVersion);
            setSearchFilter(filters[selectedCategory][defaultVersion]);
          }
        }
        setVersionChoices(versions.map((b) => ({ text: b, value: b })));
      }
    },
    [filters, manuallyApplyFilters, setSearchFilter, setSelectedVersion]
  );

  const onVersionChange = useCallback(
    ({ value }) => {
      if (!manuallyApplyFilters) {
        setSelectedVersion(value);
        setSearchFilter(filters[selectedCategory][value]);
      } else {
        setMobileVersion(value);
      }
    },
    [filters, manuallyApplyFilters, selectedCategory, setSearchFilter, setSelectedVersion]
  );

  const onCategoryChange = useCallback(
    ({ value }) => {
      if (!manuallyApplyFilters) {
        setSelectedCategory(value);
      } else {
        setMobileCategory(value);
      }
      updateVersionChoices(value, true);
    },
    [manuallyApplyFilters, setSelectedCategory, updateVersionChoices]
  );

  const applyFilters = useCallback(() => {
    const selectedFilter = filters?.[mobileCategory]?.[mobileVersion];
    if (manuallyApplyFilters && selectedFilter) {
      setSelectedCategory(mobileCategory);
      setSelectedVersion(mobileVersion);
      setSearchFilter(selectedFilter);
    }

    if (onApplyFilters) {
      onApplyFilters();
    }
  }, [
    filters,
    mobileCategory,
    mobileVersion,
    manuallyApplyFilters,
    onApplyFilters,
    setSelectedCategory,
    setSelectedVersion,
    setSearchFilter,
  ]);

  const resetFilters = useCallback(() => {
    setSearchFilter(null);
    setSelectedCategory(null);
    setSelectedVersion(null);
    setMobileCategory(null);
    setMobileVersion(null);
  }, [setSearchFilter, setSelectedVersion, setSelectedCategory]);

  // when filters are loaded, validate searchFilter from URL
  // against available searchPropertyMapping
  // update selected selectedVersion and selectedCategory automatically, if we're not manually applying filters
  useEffect(() => {
    if (!filters || !Object.keys(filters).length) {
      return;
    }
    const currentFilter = searchPropertyMapping[searchFilter];
    if (!currentFilter) {
      setSelectedCategory(null);
      setSelectedVersion(null);
      return;
    }

    const { categoryTitle, versionSelectorLabel } = currentFilter;
    if (!manuallyApplyFilters) {
      setSelectedCategory(categoryTitle);
      setSelectedVersion(versionSelectorLabel);
    }
  }, [manuallyApplyFilters, setSelectedVersion, setSelectedCategory, filters, searchFilter, searchPropertyMapping]);

  // Update filters to match an existing filter should it exist
  useEffect(() => {
    if (filters && searchFilter) {
      const currentFilter = searchPropertyMapping[searchFilter];
      if (!currentFilter) {
        return;
      }

      const { categoryTitle } = currentFilter;
      updateVersionChoices(categoryTitle);
    }
  }, [filters, searchFilter, searchPropertyMapping, updateVersionChoices]);

  // Update property choices when the filter results from Marian are loaded
  useEffect(() => {
    const properties = Object.keys(filters);
    properties.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    setCategoryChoices(properties.map((p) => ({ text: p, value: p })));
  }, [filters]);

  return (
    <div {...props}>
      <SelectWrapper>
        <MaxWidthSelect
          choices={categoryChoices}
          onChange={onCategoryChange}
          defaultText="Filter by Category"
          value={manuallyApplyFilters && mobileCategory ? mobileCategory : selectedCategory}
        />
      </SelectWrapper>
      <SelectWrapper>
        <MaxWidthSelect
          choices={versionChoices}
          onChange={onVersionChange}
          // We disable this select if there is only one option
          disabled={!selectedCategory || hasOneVersion}
          defaultText="Filter by Version"
          value={manuallyApplyFilters && mobileVersion ? mobileVersion : selectedVersion}
        />
      </SelectWrapper>
      {manuallyApplyFilters ? (
        <Button onClick={applyFilters}>Apply filters</Button>
      ) : (
        <Button leftGlyph={<Icon glyph="X" />} onClick={resetFilters}>
          Clear all filters
        </Button>
      )}
    </div>
  );
};

export default SearchFilters;
