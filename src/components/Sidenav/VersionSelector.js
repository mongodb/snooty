import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Select from '../Select';
import { VersionContext } from '../../context/version-context';
import { theme } from '../../theme/docsTheme';

const buildChoice = (branch) => {
  return {
    text: branch.urlSlug || branch.gitBranchName,
    value: branch.gitBranchName,
  };
};

const buildChoices = (branches, tocVersionNames) => {
  return !branches ? [] : branches.filter((branch) => tocVersionNames.includes(branch.gitBranchName)).map(buildChoice);
};

const StyledSelect = styled(Select)`
  flex: 1 0 auto;

  > div:first-of-type {
    max-width: 100px;
    width: max-content;
  }

  > div:nth-of-type(2) {
    min-width: 150px;
    width: max-content;
  }

  button {
    height: ${theme.size.medium};
    &[aria-expanded='true'] {
      svg {
        transform: rotate(180deg);
      }
    }
    z-index: 3;
  }
`;

const VersionSelector = ({ versionedProject = '', tocVersionNames = [] }) => {
  const { activeVersions, availableVersions, onVersionSelect } = useContext(VersionContext);
  const [options, setOptions] = useState(buildChoices(availableVersions[versionedProject], tocVersionNames));

  useEffect(() => {
    setOptions(buildChoices(availableVersions[versionedProject], tocVersionNames));
  }, [availableVersions, tocVersionNames, versionedProject]);

  const onChange = useCallback(
    ({ value }) => {
      onVersionSelect(versionedProject, value);
    },
    [onVersionSelect, versionedProject]
  );

  return (
    <StyledSelect
      value={activeVersions[versionedProject]}
      onChange={onChange}
      aria-labelledby={'select'}
      popoverZIndex={2}
      allowDeselect={false}
      choices={options}
    ></StyledSelect>
  );
};

export default VersionSelector;
