import React from 'react';
import styled from '@emotion/styled';
import { Combobox, ComboboxOption } from '@leafygreen-ui/combobox';
import { css, cx } from '@leafygreen-ui/emotion';

const DiffSelectContainer = styled.div`
  display: flex;
  gap: 14px;
  padding: 0 5px;
`;

const DiffSelectItem = styled.div`
  flex-grow: 1;
`;

const marginlessLabel = css`
  label {
    margin-bottom: 0;
  }
`;

export default function DiffSelect({
  resourceVersions,
  resourceVersionOne,
  resourceVersionTwo,
  handleVersionOneChange,
  handleVersionTwoChange,
}) {
  const versionOneOptions = resourceVersions
    .filter((version) => version !== resourceVersionTwo)
    .map((version) => (
      <ComboboxOption
        data-testid="version-one-option"
        key={version}
        displayName={version === resourceVersions[0] ? `${version} (latest)` : version}
        value={version}
      ></ComboboxOption>
    ));

  const versionTwoOptions = resourceVersions
    .filter((version) => version !== resourceVersionOne)
    .map((version) => (
      <ComboboxOption
        data-testid="version-two-option"
        key={version}
        displayName={version === resourceVersions[0] ? `${version} (latest)` : version}
        value={version}
      ></ComboboxOption>
    ));

  return (
    <DiffSelectContainer>
      <DiffSelectItem>
        <Combobox
          clearable={false}
          placeholder="Select Version"
          value={resourceVersionOne}
          label="Resource Version 1"
          className={cx(marginlessLabel)}
          onChange={handleVersionOneChange}
        >
          {versionOneOptions}
        </Combobox>
      </DiffSelectItem>
      <DiffSelectItem>
        <Combobox
          clearable={false}
          placeholder="Select Version"
          value={resourceVersionTwo}
          label="Resource Version 2"
          className={cx(marginlessLabel)}
          onChange={handleVersionTwoChange}
        >
          {versionTwoOptions}
        </Combobox>
      </DiffSelectItem>
    </DiffSelectContainer>
  );
}
