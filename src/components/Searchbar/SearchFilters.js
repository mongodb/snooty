import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
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
  :first-of-type {
    margin-bottom: ${theme.size.medium};
  }
`;

const MaxWidthSelect = styled(Select)`
  width: ${FILTER_WIDTH};
`;

const SearchFilters = ({ hasSideLabels, ...props }) => {
  const { filters } = useMarianManifests();
  const { searchFilter, setSearchFilter } = useContext(SearchContext);
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

  const onBranchChange = useCallback(({ value }) => {
    setBranch(value);
  }, []);

  const onProductChange = useCallback(
    ({ value }) => {
      setProduct(value);
      updateBranchChoices(value, true);
    },
    [updateBranchChoices]
  );

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
    if (filters && product && filters[product] && branch) {
      setSearchFilter(filters[product][branch]);
    }
  }, [branch, filters, product, setSearchFilter]);

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
    </div>
  );
};

export default SearchFilters;
