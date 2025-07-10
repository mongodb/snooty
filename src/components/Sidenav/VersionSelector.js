import React, { useCallback, useContext, useEffect, useState } from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import Select from '../Select';
import { VersionContext } from '../../context/version-context';
import { theme } from '../../theme/docsTheme';
import { isOfflineDocsBuild } from '../../utils/is-offline-docs-build';
import { selectStyling } from '../VersionDropdown';
import { getFeatureFlags } from '../../utils/feature-flags';

const buildChoice = (branch) => {
  return {
    text: branch.urlSlug || branch.gitBranchName,
    value: branch.gitBranchName,
  };
};

const buildChoices = (branches, tocVersionNames) => {
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

const VersionSelector = ({ versionedProject = '', tocVersionNames = [] }) => {
  const { isUnifiedToc } = getFeatureFlags();
  const { activeVersions, availableVersions, onVersionSelect } = useContext(VersionContext);
  const computeOptions = useCallback(() => {
    return isUnifiedToc
      ? (availableVersions[versionedProject] || []).map(buildChoice)
      : buildChoices(availableVersions[versionedProject], tocVersionNames);
  }, [availableVersions, tocVersionNames, versionedProject, isUnifiedToc]);

  const [options, setOptions] = useState(computeOptions);

  useEffect(() => {
    setOptions(computeOptions());
  }, [computeOptions]);

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
        className={cx(isUnifiedToc ? selectStyling : selectStyle)}
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
