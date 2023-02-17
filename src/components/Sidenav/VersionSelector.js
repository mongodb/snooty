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
    width: 150px;
    right: 0px;
    left: unset;

    @media ${theme.screenSize.upToLarge} {
      width: max-content;
      max-width: calc(100vw - (${theme.size.medium} * 2));
      // (max viewport width - padding) inferred from the max width of the side nav in mobile
    }
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

  span {
    overflow: hidden;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
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
