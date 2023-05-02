import styled from '@emotion/styled';
import { SegmentedControl, SegmentedControlOption } from '@leafygreen-ui/segmented-control';
import { Combobox, ComboboxOption, ComboboxGroup } from '@leafygreen-ui/combobox';

import { ALL_VERSIONS, COMPARE_VERSIONS } from './OpenAPIChangelog';

const Wrapper = styled.div`
  width: 100%;
  margin-top: 32px;
`;

function VersionModeSegmentedControl({ versionMode, handleVersionModeChange }) {
  return (
    <SegmentedControl key="changelog-view" value={versionMode} onChange={handleVersionModeChange}>
      <SegmentedControlOption key="all-versions" value={ALL_VERSIONS}>
        All Versions
      </SegmentedControlOption>
      <SegmentedControlOption key="compare-versions" value={COMPARE_VERSIONS}>
        Compare Two Versions
      </SegmentedControlOption>
    </SegmentedControl>
  );
}

const ResourceSelectContainer = styled.div`
  width: 100%;
  margin-top: 24px;
`;

function ResourceSelect() {
  return (
    <ResourceSelectContainer>
      <Combobox label="Select Resource">
        <ComboboxOption value="apple" />
        <ComboboxOption value="banana" />
        <ComboboxOption value="carrot" />
        <ComboboxOption value="dragonfruit" />
        <ComboboxGroup label="Peppers">
          <ComboboxOption value="cayenne" />
          <ComboboxOption value="habanero" />
          <ComboboxOption value="jalapeno" displayName="Jalapeño" />
        </ComboboxGroup>
      </Combobox>
    </ResourceSelectContainer>
  );
}

const FiltersPanel = ({ versionMode, handleVersionModeChange }) => {
  return (
    <Wrapper>
      <VersionModeSegmentedControl versionMode={versionMode} handleVersionModeChange={handleVersionModeChange} />
      <ResourceSelect />
    </Wrapper>
  );
};

export default FiltersPanel;
