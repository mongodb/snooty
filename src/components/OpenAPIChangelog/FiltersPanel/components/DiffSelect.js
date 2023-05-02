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

export default function DiffSelect({ resourceVersions }) {
  const versionOptions = resourceVersions.map((version) => (
    <ComboboxOption key={version} value={version}></ComboboxOption>
  ));

  return (
    <DiffSelectContainer>
      <DiffSelectItem>
        <Combobox label="Resource Version 1">{versionOptions}</Combobox>
      </DiffSelectItem>
      <DiffSelectItem>
        <Combobox label="Resource Version 2">{versionOptions}</Combobox>
      </DiffSelectItem>
    </DiffSelectContainer>
  );
}
