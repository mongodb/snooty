import { Combobox, ComboboxOption } from '@leafygreen-ui/combobox';
import styled from '@emotion/styled';

const ResourceSelectContainer = styled.div`
  width: 100%;
  margin-top: 24px;
`;

export default function ResourceSelect({ resources, setSelectedResources }) {
  return (
    <ResourceSelectContainer>
      <Combobox label="Select Resource" placeholder="All" onChange={setSelectedResources} multiselect>
        {resources.map((version) => (
          <ComboboxOption key={version} value={version} data-testid="resource-select-option" />
        ))}
      </Combobox>
    </ResourceSelectContainer>
  );
}
