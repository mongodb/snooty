import styled from '@emotion/styled';
import { Combobox, ComboboxOption, ComboboxGroup } from '@leafygreen-ui/combobox';
import VersionModeSegmentedControl from './VersionModeSegmentedControl';

const Wrapper = styled.div`
  width: 100%;
  margin-top: 32px;
`;

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
