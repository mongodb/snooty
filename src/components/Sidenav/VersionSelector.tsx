import React, { useCallback, useContext, useEffect, useState } from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import Select from '../Select';
import { VersionContext } from '../../context/version-context';
import { theme } from '../../theme/docsTheme';
import { isOfflineDocsBuild } from '../../utils/is-offline-docs-build';
import { BranchData } from '../../types/data';

const buildChoice = (branch: BranchData) => {
  return {
    text: branch.urlSlug || branch.gitBranchName,
    value: branch.gitBranchName,
  };
};

const buildChoices = (branches: BranchData[], tocVersionNames: string[]) => {
  return !branches ? [] : branches.filter((branch) => tocVersionNames.includes(branch.gitBranchName)).map(buildChoice);
};

const selectStyle = css`
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
  }

  span {
    overflow: hidden;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
`;

const wrapperStyle = css`
  margin-left: auto;
`;

export type VersionSelectorProps = {
  versionedProject?: string;
  tocVersionNames?: string[];
};

const VersionSelector = ({ versionedProject = '', tocVersionNames = [] }) => {
  const { activeVersions, availableVersions, onVersionSelect } = useContext(VersionContext);
  const [options, setOptions] = useState(buildChoices(availableVersions[versionedProject], tocVersionNames));

  useEffect(() => {
    setOptions(buildChoices(availableVersions[versionedProject], tocVersionNames));
  }, [availableVersions, tocVersionNames, versionedProject]);

  const onChange = useCallback(
    ({ value }: { value: string }) => {
      onVersionSelect(versionedProject, value);
    },
    [onVersionSelect, versionedProject]
  );

  const onClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div onClick={onClick} className={cx(wrapperStyle)}>
      <Select
        value={activeVersions[versionedProject]}
        className={cx(selectStyle)}
        onChange={onChange}
        aria-labelledby={'select'}
        choices={options}
        disabled={isOfflineDocsBuild}
      ></Select>
    </div>
  );
};

export default VersionSelector;
