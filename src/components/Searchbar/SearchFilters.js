import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import { theme } from '../../theme/docsTheme';
import Select from '../Select';
import { getSortedBranchesForProperty, parseMarianManifest } from '../../utils/parse-marian-manifests';
import { useMarianManifests } from '../../hooks/use-marian-manifests';
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
  const { filters } = useMarianManifests();
  const {
    searchFilter,
    setSearchFilter,
    selectedVersion,
    selectedCategory,
    setSelectedVersion,
    setSelectedCategory,
  } = useContext(SearchContext);

  // Current category and version for dropdown. If manuallyApplyFilter === true, selectedCategory + selectedVersion
  // will not be set automatically.
  const [categoryChoices, setCategoryChoices] = useState([]);
  const [category, setCategory] = useState(null);
  const [versionChoices, setVersionChoices] = useState([]);
  const [version, setVersion] = useState(null);

  const hasOneVersion = useMemo(() => versionChoices && versionChoices.length === 1, [versionChoices]);

  const updateVersionChoices = useCallback(
    (category, setDefaultVersion = false) => {
      if (filters && filters[category]) {
        const versions = getSortedBranchesForProperty(filters, category);
        if (setDefaultVersion) {
          setVersion(versions[0]);
        }
        setVersionChoices(versions.map((b) => ({ text: b, value: b })));
      }
    },
    [filters]
  );

  const onVersionChange = useCallback(({ value }) => {
    setVersion(value);
  }, []);

  const onCategoryChange = useCallback(
    ({ value }) => {
      setCategory(value);
      updateVersionChoices(value, true);
    },
    [updateVersionChoices]
  );

  const applyFilters = useCallback(() => {
    setSelectedCategory(category);
    setSelectedVersion(version);

    if (onApplyFilters) {
      onApplyFilters();
    }
  }, [version, onApplyFilters, category, setSelectedVersion, setSelectedCategory]);

  const resetFilters = useCallback(() => {
    setSearchFilter(null);
    setCategory(null);
    setVersion(null);
    setSelectedCategory(null);
    setSelectedVersion(null);
  }, [setSearchFilter, setSelectedVersion, setSelectedCategory]);

  // Update selected version and category automatically, if we're not manually applying filters
  useEffect(() => {
    if (!manuallyApplyFilters) {
      setSelectedVersion(version);
      setSelectedCategory(category);
    }
  }, [version, manuallyApplyFilters, category, setSelectedVersion, setSelectedCategory]);

  // Update filters to match an existing filter should it exist
  useEffect(() => {
    if (filters && searchFilter) {
      const { branch, property } = parseMarianManifest(searchFilter);
      setCategory(property);
      updateVersionChoices(property);
      setVersion(branch);
    } else {
      setCategory(null);
      setVersion(null);
    }
  }, [filters, searchFilter, updateVersionChoices]);

  // Update property choices when the filter results from Marian are loaded
  useEffect(() => {
    const properties = Object.keys(filters);
    properties.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    setCategoryChoices(properties.map((p) => ({ text: p, value: p })));
  }, [filters]);

  // Update search filter once a property and version are chosen
  useEffect(() => {
    if (filters && selectedCategory && filters[selectedCategory] && selectedVersion && !manuallyApplyFilters) {
      setSearchFilter(filters[selectedCategory][selectedVersion]);
    }
  }, [filters, manuallyApplyFilters, selectedVersion, selectedCategory, setSearchFilter]);

  return (
    <div {...props}>
      <SelectWrapper>
        <MaxWidthSelect
          choices={categoryChoices}
          onChange={onCategoryChange}
          defaultText="Filter by Category"
          value={category}
        />
      </SelectWrapper>
      <SelectWrapper>
        <MaxWidthSelect
          choices={versionChoices}
          onChange={onVersionChange}
          // We disable this select if there is only one option
          disabled={!category || hasOneVersion}
          defaultText="Filter by Version"
          value={version}
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
