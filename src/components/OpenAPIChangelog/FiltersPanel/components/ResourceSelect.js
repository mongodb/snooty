import { Combobox, ComboboxOption } from '@leafygreen-ui/combobox';
import styled from '@emotion/styled';

const ResourceSelectContainer = styled.div`
  width: 100%;
  margin-top: 24px;
`;

export default function ResourceSelect({ resources, selectedResource, handleChange }) {
  return (
    <ResourceSelectContainer>
      <Combobox label="Select Resource" value={selectedResource} onChange={handleChange}>
        {resources.map((version) => (
          <ComboboxOption key={version} value={version} data-testid="resource-select-option" />
        ))}
      </Combobox>
    </ResourceSelectContainer>
  );
}
