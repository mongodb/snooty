import React from 'react';
import styled from '@emotion/styled';
import { Combobox, ComboboxOption } from '@leafygreen-ui/combobox';
import { SegmentedControl, SegmentedControlOption } from '@leafygreen-ui/segmented-control';
import { ALL_VERSIONS, COMPARE_VERSIONS } from '../../../utils/constants';
import DiffSelect from './DiffSelect';

const Wrapper = styled.div`
  width: 100%;
  margin-top: 32px;
`;

const StyledSegmentedControl = styled(SegmentedControl)`
  margin-bottom: 32px;
`;

const ResourceSelectContainer = styled.div`
  width: 100%;
  margin-top: 18px;
`;

const ResourceSelect = styled(Combobox)`
  label {
    margin-bottom: 0;
  }

  span > span {
    text-decoration: none;
  }
`;

const FiltersPanel = ({
  versionMode,
  resourceVersions,
  resources,
  setSelectedResources,
  resourceVersionOne,
  resourceVersionTwo,
  setVersionMode,
  setResourceVersionOne,
  setResourceVersionTwo,
}) => {
  return (
    <Wrapper>
      <StyledSegmentedControl value={versionMode} onChange={setVersionMode}>
        <SegmentedControlOption data-testid="all-versions-option" value={ALL_VERSIONS}>
          All Versions
        </SegmentedControlOption>
        <SegmentedControlOption data-testid="version-control-option" value={COMPARE_VERSIONS}>
          Compare Two Versions
        </SegmentedControlOption>
      </StyledSegmentedControl>
      {versionMode === COMPARE_VERSIONS && (
        <DiffSelect
          resourceVersionOne={resourceVersionOne}
          resourceVersionTwo={resourceVersionTwo}
          resourceVersions={resourceVersions}
          handleVersionOneChange={setResourceVersionOne}
          handleVersionTwoChange={setResourceVersionTwo}
        />
      )}
      <ResourceSelectContainer>
        <ResourceSelect label="Select Resource" placeholder="All" onChange={setSelectedResources} multiselect>
          {resources.map((version) => (
            <ComboboxOption key={version} value={version} data-testid="resource-select-option" />
          ))}
        </ResourceSelect>
      </ResourceSelectContainer>
    </Wrapper>
  );
};

export default FiltersPanel;
