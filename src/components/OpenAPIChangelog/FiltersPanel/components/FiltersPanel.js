import React from 'react';
import styled from '@emotion/styled';
import { Combobox, ComboboxOption } from '@leafygreen-ui/combobox';
import { SegmentedControl, SegmentedControlOption } from '@leafygreen-ui/segmented-control';
import DiffSelect from './DiffSelect';

const Wrapper = styled.div`
  width: 100%;
  margin-top: 32px;
`;

const ResourceSelectContainer = styled.div`
  width: 100%;
  margin-top: 24px;
`;
const FiltersPanel = ({
  isVersionCompare,
  resourceVersions,
  resources,
  setSelectedResources,
  resourceVersionOne,
  resourceVersionTwo,
  setIsVersionCompare,
  setResourceVersionOne,
  setResourceVersionTwo,
}) => {
  return (
    <Wrapper>
      <SegmentedControl value={isVersionCompare} onChange={setIsVersionCompare}>
        <SegmentedControlOption data-testid="all-versions-option" value={false}>
          All Versions
        </SegmentedControlOption>
        <SegmentedControlOption data-testid="version-control-option" value={true}>
          Compare Two Versions
        </SegmentedControlOption>
      </SegmentedControl>
      {isVersionCompare && (
        <DiffSelect
          resourceVersionOne={resourceVersionOne}
          resourceVersionTwo={resourceVersionTwo}
          resourceVersions={resourceVersions}
          handleVersionOneChange={setResourceVersionOne}
          handleVersionTwoChange={setResourceVersionTwo}
        />
      )}
      <ResourceSelectContainer>
        <Combobox label="Select Resource" placeholder="All" onChange={setSelectedResources} multiselect>
          {resources.map((version) => (
            <ComboboxOption key={version} value={version} data-testid="resource-select-option" />
          ))}
        </Combobox>
      </ResourceSelectContainer>
    </Wrapper>
  );
};

export default FiltersPanel;
