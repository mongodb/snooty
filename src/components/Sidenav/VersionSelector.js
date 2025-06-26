import React, { useCallback, useContext, useEffect, useState } from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import Select from '../Select';
import { VersionContext } from '../../context/version-context';
import { theme } from '../../theme/docsTheme';
import { isOfflineDocsBuild } from '../../utils/is-offline-docs-build';

const buildChoice = (branch) => {
  return {
    text: branch.urlSlug || branch.gitBranchName,
    value: branch.gitBranchName,
  };
};

// const buildChoices = (branches, tocVersionNames) => {
//   return !branches ? [] : branches.filter((branch) => tocVersionNames.includes(branch.gitBranchName)).map(buildChoice);
// };

const selectStyle = css`
  margin: ${theme.size.small} ${theme.size.medium} ${theme.size.small} ${theme.size.medium};

  ${'' /* Render version dropdown text in front of the Sidebar text */}
  button {
    z-index: 2;
    background-color: var(--select-button-bg-color);
    color: var(--select-button-color);

    div:last-child svg {
      color: var(--select-button-carot);
    }

    .dark-theme &:hover {
      background-color: var(--gray-dark4);
      color: var(--gray-light3);
      border-color: var(--gray-base);
      box-shadow: var(--gray-dark2) 0px 0px 0px 3px;
    }
  }

  /* Override LG mobile style of enlarged mobile font */
  @media ${theme.screenSize.upToLarge} {
    div,
    span {
      font-size: ${theme.fontSize.small};
    }
  }
`;

const wrapperStyle = css`
  // margin-left: auto;
`;

const VersionSelector = ({ versionedProject = '', tocVersionNames = [] }) => {
  const { activeVersions, availableVersions, onVersionSelect } = useContext(VersionContext);
  const [options, setOptions] = useState((availableVersions[versionedProject] || []).map(buildChoice));

  useEffect(() => {
    setOptions((availableVersions[versionedProject] || []).map(buildChoice));
  }, [availableVersions, tocVersionNames, versionedProject]);

  const onChange = useCallback(
    ({ value }) => {
      onVersionSelect(versionedProject, value);
    },
    [onVersionSelect, versionedProject]
  );

  const onClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <div onClick={onClick} className={cx(wrapperStyle)}>
      <Select
        value={activeVersions[versionedProject]}
        className={cx(selectStyle)}
        onChange={onChange}
        aria-labelledby={'select'}
        popoverZIndex={2}
        allowDeselect={false}
        choices={options}
        disabled={isOfflineDocsBuild}
      ></Select>
    </div>
  );
};

export default VersionSelector;
