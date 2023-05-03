import React from 'react';
import styled from '@emotion/styled';
import { Combobox, ComboboxOption } from '@leafygreen-ui/combobox';

const DiffSelectContainer = styled.div`
  display: flex;
  gap: 14px;
`;
const DiffSelectItem = styled.div`
  flex-grow: 1;
`;

export default function DiffSelect({ resourceVersions, resourceVersionOne, resourceVersionTwo }) {
  const versionOneOptions = resourceVersions
    .filter((version) => version !== resourceVersionTwo)
    .map((version) => <ComboboxOption key={version} value={version}></ComboboxOption>);

  const versionTwoOptions = resourceVersions
    .filter((version) => version !== resourceVersionOne)
    .map((version) => <ComboboxOption key={version} value={version}></ComboboxOption>);

  return (
    <DiffSelectContainer>
      <DiffSelectItem>
        <Combobox value={resourceVersionOne} label="Resource Version 1">
          {versionOneOptions}
        </Combobox>
      </DiffSelectItem>
      <DiffSelectItem>
        <Combobox value={resourceVersionTwo} label="Resource Version 2">
          {versionTwoOptions}
        </Combobox>
      </DiffSelectItem>
    </DiffSelectContainer>
  );
}
