import { Combobox, ComboboxOption } from '@leafygreen-ui/combobox';
import styled from '@emotion/styled';

const ResourceSelectContainer = styled.div`
  width: 100%;
  margin-top: 24px;
`;

export default function ResourceSelect({ resourceVersions }) {
  return (
    <ResourceSelectContainer>
      <Combobox label="Select Resource">
        {resourceVersions.map((version) => (
          <ComboboxOption value={version} />
        ))}
      </Combobox>
    </ResourceSelectContainer>
  );
}
