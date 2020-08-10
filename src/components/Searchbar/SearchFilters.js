import React, { useCallback, useContext, useEffect, useState } from 'react';
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

  // TODO: On mount, update filters with current values
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchFilter]);

  const updateBranchChoices = useCallback(
    (product, setDefaultBranch = false) => {
      if (filters && filters[product]) {
        const branches = getSortedBranchesForProperty(filters, product);
        if (setDefaultBranch) {
          setBranch(branches[0]);
        }
        setBranchChoices(branches.map(b => ({ text: b, value: b })));
      }
    },
    [filters]
  );

  // Update property choices when the filter results from Marian are loaded
  useEffect(() => {
    const properties = Object.keys(filters);
    properties.sort();
    setProductChoices(properties.map(p => ({ text: p, value: p })));
  }, [filters]);

  // Update branch choices when a property is chosen

  // TODO: Update parent when choices are made
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
          onChange={({ value }) => {
            setProduct(value);
            updateBranchChoices(value, true);
          }}
          defaultText="Select a Product"
          value={product}
        />
      </SelectWrapper>
      <SelectWrapper>
        {hasSideLabels && <SideLabelText>Version</SideLabelText>}
        <MaxWidthSelect
          choices={branchChoices}
          onChange={({ value }) => setBranch(value)}
          disabled={!product}
          defaultText="Select a Version"
          value={branch}
        />
      </SelectWrapper>
    </div>
  );
};

export default SearchFilters;
