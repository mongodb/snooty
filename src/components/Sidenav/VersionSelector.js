import React, { useCallback, useContext, useEffect, useState } from 'react';
import Select from '../Select';
import { VersionContext } from '../../context/version-context';
import styled from '@emotion/styled';
import { theme } from '../../theme/docsTheme';

const buildChoice = (branch) => {
  return {
    text: branch.urlSlug || branch.gitBranchName,
    value: branch.gitBranchName,
  };
};

const buildChoices = (branches) => {
  return !branches ? [] : branches.map(buildChoice);
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

const VersionSelector = ({ versionedProject = '' }) => {
  // verify if this version selector is for current product
  // determines if we should use reach router or not
  // ie. on atlas-cli  v1.3 , switch to v1.0 -> should update link (what if link is 404)
  const { activeVersions, availableVersions, onVersionSelect } = useContext(VersionContext);

  const [options, setOptions] = useState(buildChoices(availableVersions[versionedProject]));

  useEffect(() => {
    setOptions(buildChoices(availableVersions[versionedProject]));
  }, [availableVersions, versionedProject]);

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
