import React, { useContext, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../theme/docsTheme';
import Select from '../Select';
import SearchContext from './SearchContext';
import { getSortedBranchesForProperty, parseMarianManifest } from '../../utils/parse-marian-manifests';
import { useMarianManifests } from '../../hooks/use-marian-manifests';

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

const SearchFilters = ({ hasSideLabels, localSearchFilter, setLocalSearchFilter, ...props }) => {
  const { filters } = useMarianManifests();
  const [propertyChoices, setPropertyChoices] = useState([]);
  const [property, setProperty] = useState(null);
  const [branchChoices, setBranchChoices] = useState([]);
  const [branch, setBranch] = useState(null);

  // On mount, update filters with current values
  // TODO fix so other hooks don't trigger
  useEffect(() => {
    if (localSearchFilter) {
      const { property, branch } = parseMarianManifest(localSearchFilter);
      setProperty(property);
      setBranch(branch);
    } else {
      setProperty(null);
      setBranch(null);
    }
    // Ignoring exhaustive deps allows us to only run this on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearchFilter]);

  // Update property choices when the filter results from Marian are loaded
  useEffect(() => {
    const properties = Object.keys(filters);
    properties.sort();
    setPropertyChoices(properties.map(p => ({ text: p, value: p })));
  }, [filters]);

  // Update branch choices when a property is chosen
  useEffect(() => {
    if (filters && filters[property]) {
      const branches = getSortedBranchesForProperty(filters, property);
      setBranch(branches[0]);
      setBranchChoices(branches.map(b => ({ text: b, value: b })));
    }
  }, [filters, property]);

  // When a property and branch are chosen, update the filter to the Marian manifest value
  useEffect(() => {
    if (filters && property && branch && filters[property]) {
      setLocalSearchFilter(filters[property][branch]);
    }
  }, [branch, filters, property, setLocalSearchFilter]);

  return (
    <div {...props}>
      <SelectWrapper>
        {hasSideLabels && <SideLabelText>Product</SideLabelText>}
        <MaxWidthSelect
          choices={propertyChoices}
          onChange={({ value }) => setProperty(value)}
          defaultText="Select a Product"
          value={property}
        />
      </SelectWrapper>
      <SelectWrapper>
        {hasSideLabels && <SideLabelText>Version</SideLabelText>}
        <MaxWidthSelect
          choices={branchChoices}
          onChange={({ value }) => setBranch(value)}
          disabled={!property}
          defaultText="Select a Version"
          value={branch}
        />
      </SelectWrapper>
    </div>
  );
};

export default SearchFilters;
