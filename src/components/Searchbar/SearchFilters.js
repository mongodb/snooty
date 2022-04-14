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

const SideLabelText = styled('p')`
  font-family: Akzidenz;
  font-size: ${theme.fontSize.small};
  letter-spacing: 0.5px;
  margin: 0;
`;

const SelectWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme.size.default};
`;

const MaxWidthSelect = styled(Select)`
  width: ${FILTER_WIDTH};
`;

const SearchFilters = ({ hasSideLabels, manuallyApplyFilters = false, onApplyFilters, ...props }) => {
  const { filters } = useMarianManifests();
  const {
    searchFilter,
    setSearchFilter,
    selectedVersion,
    selectedProduct,
    setSelectedVersion,
    setSelectedProduct,
  } = useContext(SearchContext);

  // Current product and version for dropdown. If manuallyApplyFilter === true, selectedProduct + selectedVersion
  // will not be set automatically.
  const [productChoices, setProductChoices] = useState([]);
  const [product, setProduct] = useState(null);
  const [versionChoices, setVersionChoices] = useState([]);
  const [version, setVersion] = useState(null);

  const hasOneVersion = useMemo(() => versionChoices && versionChoices.length === 1, [versionChoices]);

  const updateVersionChoices = useCallback(
    (product, setDefaultVersion = false) => {
      if (filters && filters[product]) {
        const versions = getSortedBranchesForProperty(filters, product);
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

  const onProductChange = useCallback(
    ({ value }) => {
      setProduct(value);
      updateVersionChoices(value, true);
    },
    [updateVersionChoices]
  );

  const applyFilters = useCallback(() => {
    setSelectedProduct(product);
    setSelectedVersion(version);

    if (onApplyFilters) {
      onApplyFilters();
    }
  }, [version, onApplyFilters, product, setSelectedVersion, setSelectedProduct]);

  const resetFilters = useCallback(() => {
    setSearchFilter(null);
    setProduct(null);
    setVersion(null);
    setSelectedProduct(null);
    setSelectedVersion(null);
  }, [setSearchFilter, setSelectedVersion, setSelectedProduct]);

  // Update selected version and product automatically, if we're not manually applying filters
  useEffect(() => {
    if (!manuallyApplyFilters) {
      setSelectedVersion(version);
      setSelectedProduct(product);
    }
  }, [version, manuallyApplyFilters, product, setSelectedVersion, setSelectedProduct]);

  // Update filters to match an existing filter should it exist
  useEffect(() => {
    if (filters && searchFilter) {
      const { branch, property } = parseMarianManifest(searchFilter);
      setProduct(property);
      updateVersionChoices(property);
      setVersion(branch);
    } else {
      setProduct(null);
      setVersion(null);
    }
  }, [filters, searchFilter, updateVersionChoices]);

  // Update property choices when the filter results from Marian are loaded
  useEffect(() => {
    const properties = Object.keys(filters);
    properties.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    setProductChoices(properties.map((p) => ({ text: p, value: p })));
  }, [filters]);

  // Update search filter once a property and version are chosen
  useEffect(() => {
    if (filters && selectedProduct && filters[selectedProduct] && selectedVersion && !manuallyApplyFilters) {
      setSearchFilter(filters[selectedProduct][selectedVersion]);
    }
  }, [filters, manuallyApplyFilters, selectedVersion, selectedProduct, setSearchFilter]);

  return (
    <div {...props}>
      <SelectWrapper>
        {hasSideLabels && <SideLabelText>Product</SideLabelText>}
        <MaxWidthSelect
          choices={productChoices}
          onChange={onProductChange}
          defaultText="Select a Product"
          value={product}
        />
      </SelectWrapper>
      <SelectWrapper>
        {hasSideLabels && <SideLabelText>Version</SideLabelText>}
        <MaxWidthSelect
          choices={versionChoices}
          onChange={onVersionChange}
          // We disable this select if there is only one option
          disabled={!product || hasOneVersion}
          defaultText="Select a Version"
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
