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
    selectedBranch,
    selectedProduct,
    setSelectedBranch,
    setSelectedProduct,
  } = useContext(SearchContext);

  // Current product and branch for dropdown. If manuallyApplyFilter === true, selectedProduct + selectedBranch
  // will not be set automatically.
  const [productChoices, setProductChoices] = useState([]);
  const [product, setProduct] = useState(null);
  const [branchChoices, setBranchChoices] = useState([]);
  const [branch, setBranch] = useState(null);

  const hasOneBranch = useMemo(() => branchChoices && branchChoices.length === 1, [branchChoices]);

  const updateBranchChoices = useCallback(
    (product, setDefaultBranch = false) => {
      if (filters && filters[product]) {
        const branches = getSortedBranchesForProperty(filters, product);
        if (setDefaultBranch) {
          setBranch(branches[0]);
        }
        setBranchChoices(branches.map((b) => ({ text: b, value: b })));
      }
    },
    [filters]
  );

  const onBranchChange = useCallback(
    ({ value }) => {
      setBranch(value);
    },
    [setBranch]
  );

  const onProductChange = useCallback(
    ({ value }) => {
      setProduct(value);
      updateBranchChoices(value, true);
    },
    [updateBranchChoices]
  );

  const applyFilters = useCallback(() => {
    setSelectedProduct(product);
    setSelectedBranch(branch);

    if (onApplyFilters) {
      onApplyFilters();
    }
  }, [branch, onApplyFilters, product, setSelectedBranch, setSelectedProduct]);

  const resetFilters = useCallback(() => {
    setSearchFilter(null);
    setProduct(null);
    setBranch(null);
    setSelectedProduct(null);
    setSelectedBranch(null);
  }, [setSearchFilter, setSelectedBranch, setSelectedProduct]);

  // Update selected branch and product automatically, if we're not manually applying filters
  useEffect(() => {
    if (!manuallyApplyFilters) {
      setSelectedBranch(branch);
      setSelectedProduct(product);
    }
  }, [branch, manuallyApplyFilters, product, setSelectedBranch, setSelectedProduct]);

  // Update filters to match an existing filter should it exist
  useEffect(() => {
    if (filters && searchFilter) {
      const { branch, property } = parseMarianManifest(searchFilter);
      setProduct(property);
      updateBranchChoices(property);
      setBranch(branch);
    } else {
      setProduct(null);
      setBranch(null);
    }
  }, [filters, searchFilter, updateBranchChoices]);

  // Update property choices when the filter results from Marian are loaded
  useEffect(() => {
    const properties = Object.keys(filters);
    properties.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    setProductChoices(properties.map((p) => ({ text: p, value: p })));
  }, [filters]);

  // Update search filter once a property and branch are chosen
  useEffect(() => {
    if (filters && selectedProduct && filters[selectedProduct] && selectedBranch && !manuallyApplyFilters) {
      setSearchFilter(filters[selectedProduct][selectedBranch]);
    }
  }, [filters, manuallyApplyFilters, selectedBranch, selectedProduct, setSearchFilter]);

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
          choices={branchChoices}
          onChange={onBranchChange}
          // We disable this select if there is only one option
          disabled={!product || hasOneBranch}
          defaultText="Select a Version"
          value={branch}
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
