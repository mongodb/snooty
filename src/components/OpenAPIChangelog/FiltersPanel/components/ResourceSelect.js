import { Combobox, ComboboxOption, ComboboxGroup } from '@leafygreen-ui/combobox';
import styled from '@emotion/styled';

const ResourceSelectContainer = styled.div`
  width: 100%;
  margin-top: 24px;
`;

export default function ResourceSelect() {
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
