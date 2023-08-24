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

  const hasOneVersion = useMemo(() => versionChoices && versionChoices.length === 1, [versionChoices]);

  const updateVersionChoices = useCallback(
    (selectedCategory, setDefaultVersion = false) => {
      if (filters && filters[selectedCategory]) {
        const versions = getSortedBranchesForProperty(filters, selectedCategory);
        if (setDefaultVersion) {
          setSelectedVersion(versions[0]);
          setSearchFilter(filters[selectedCategory][versions[0]]);
        }
        setVersionChoices(versions.map((b) => ({ text: b, value: b })));
      }
    },
    [filters, setSearchFilter, setSelectedVersion]
  );

  const onVersionChange = useCallback(
    ({ value }) => {
      setSelectedVersion(value);
      setSearchFilter(filters[selectedCategory][value]);
    },
    [filters, selectedCategory, setSearchFilter, setSelectedVersion]
  );

  const onCategoryChange = useCallback(
    ({ value }) => {
      setSelectedCategory(value);
      updateVersionChoices(value, true);
    },
    [setSelectedCategory, updateVersionChoices]
  );

  const applyFilters = useCallback(() => {
    setSelectedCategory(selectedCategory);
    setSelectedVersion(selectedVersion);

    if (onApplyFilters) {
      onApplyFilters();
    }
  }, [selectedVersion, onApplyFilters, selectedCategory, setSelectedVersion, setSelectedCategory]);

  const resetFilters = useCallback(() => {
    setSearchFilter(null);
    setSelectedCategory(null);
    setSelectedVersion(null);
  }, [setSearchFilter, setSelectedVersion, setSelectedCategory]);

  // Update selected selectedVersion and selectedCategory automatically, if we're not manually applying filters
  useEffect(() => {
    if (!manuallyApplyFilters) {
      setSelectedVersion(selectedVersion);
      setSelectedCategory(selectedCategory);
    }
  }, [selectedVersion, manuallyApplyFilters, selectedCategory, setSelectedVersion, setSelectedCategory]);

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
          value={selectedCategory}
        />
      </SelectWrapper>
      <SelectWrapper>
        <MaxWidthSelect
          choices={versionChoices}
          onChange={onVersionChange}
          // We disable this select if there is only one option
          disabled={!selectedCategory || hasOneVersion}
          defaultText="Filter by Version"
          value={selectedVersion}
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
