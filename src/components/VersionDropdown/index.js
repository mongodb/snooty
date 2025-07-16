import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { cx, css as LeafyCSS } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { Option, OptionGroup, Select } from '@leafygreen-ui/select';
import { VersionContext } from '../../context/version-context';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { theme } from '../../theme/docsTheme';
import { useCurrentUrlSlug, getBranchSlug } from '../../hooks/use-current-url-slug';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { isOfflineDocsBuild } from '../../utils/is-offline-docs-build';

export const selectStyling = LeafyCSS`
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

// Gets UI labels for supplied active branch names
export const getUILabel = (branch) => {
  if (!branch['active']) {
    console.warn(
      `Retrieving branch UI label for legacy/EOL'd/inactive branch: ${branch['gitBranchName']}. This should probably not be happening.`
    );
  }
  return branch['versionSelectorLabel'] || createVersionLabel(branch['urlSlug'], branch['gitBranchName']);
};

// If a UI label is not specified for raw versions (e.g. v1.0), create one
// Example: [1.0 or v1.0 or android-v1.0] -> Version 1.0
const createVersionLabel = (urlSlug = '', gitBranchName = '') => {
  if (!urlSlug && !gitBranchName) {
    console.warn('Unable to create version label - neither gitBranchName nor urlSlug defined');
    return 'Version Name Unknown';
  }

  const label = urlSlug || gitBranchName;
  // If the label is numeric (e.g. "2.0" or "v2.0"), we display "Version 2.0"
  if (!isNaN(label)) {
    return `Version ${label}`;
  } else if (label.startsWith('v') && !isNaN(label.slice(1))) {
    return `Version ${label.slice(1)}`;
  }

  return label;
};

// Returns all branches that are neither in 'groups' nor inactive
const getActiveUngroupedBranches = (branches = [], groups = []) => {
  const groupedBranchNames = groups.map((g) => g['includedBranches']).flat() || [];
  return branches.filter((b) => !groupedBranchNames.includes(b['gitBranchName']) && !!b['active']);
};

// Return a branch object from branches that matches supplied branchName
// Typically used to associate a branchName from 'groups' with a branchName in 'branches'
const getBranch = (branchName = '', branches = []) => {
  const branchCandidates = branches.filter((b) => b['gitBranchName'] === branchName);

  if (branchCandidates.length === 0) {
    console.warn(`Could not find branch in 'branches' with gitBranchName: ${branchName}. Check 'groups'.`);
    return null;
  }

  if (branchCandidates.length > 1) {
    console.warn(`Too many branches with name ${branchName}.`);
    return null;
  }

  return branchCandidates?.[0] || null;
};

const createOption = (branch) => {
  const UIlabel = getUILabel(branch);
  const slug = getBranchSlug(branch);
  return (
    <Option key={slug} value={branch.gitBranchName}>
      {UIlabel}
    </Option>
  );
};

const VersionDropdown = () => {
  const { parserBranch } = useSiteMetadata();
  const { project, eol } = useSnootyMetadata();
  const { availableVersions, availableGroups, onVersionSelect, showEol, activeVersions } = useContext(VersionContext);
  let branches = availableVersions[project];
  let groups = availableGroups[project];

  const onSelectChange = useCallback(
    (value) => {
      onVersionSelect(project, value);
    },
    [onVersionSelect, project]
  );

  // Attempts to reconcile differences between urlSlug and the parserBranch provided to this component
  // Used to ensure that the value of the select is set to the urlSlug if the urlSlug is present and differs from the gitBranchName
  const currentUrlSlug = useCurrentUrlSlug(parserBranch, branches);

  if ((branches?.length ?? 0) < 1) {
    console.warn('Insufficient branches supplied to VersionDropdown; expected 1 or more');
    return null;
  }

  // For exclusively Realm SDK pages, we show a subset of the versions depending
  // on the current page selection. For example, on the Android SDK page, we only
  // show Android SDK versions in the version dropdown box.
  if (project === 'realm' && currentUrlSlug?.startsWith('sdk/')) {
    const currentSdkGroup = groups.find((g) => currentUrlSlug.startsWith(g?.['sharedSlugPrefix']));
    if (currentSdkGroup) {
      groups = [currentSdkGroup];
      const includedBranches = currentSdkGroup['includedBranches'];
      branches = branches.filter((b) => includedBranches.includes(b['gitBranchName']));
    }
  }

  const activeUngroupedBranches = getActiveUngroupedBranches(branches, groups) || [];

  const eolVersionFlipperStyle = LeafyCSS`
    & > button {
      background-color: ${palette.gray.light2} !important;
      color: ${palette.gray.base} !important;
    }
  `;

  // TODO: Unfortunately, the Select component seems to buck the ConditionalWrapper component
  // It would be nice to either use the ConditionalWrapper to disable the OptionGroup
  // OR have the OptionGroup not take up space when a label is empty-string. For now,
  // ungrouped branches are handled in a separate array.
  return (
    <Select
      role="button"
      allowDeselect={false}
      className={cx(selectStyling, eol ? eolVersionFlipperStyle : '')}
      aria-labelledby="View a different version of documentation."
      defaultValue="master"
      onChange={onSelectChange}
      placeholder={'Select a version'}
      popoverZIndex={3}
      value={activeVersions[project]}
      usePortal={false}
      disabled={isOfflineDocsBuild || eol}
    >
      {activeUngroupedBranches?.map((b) => createOption(b))}
      {groups?.map((group) => {
        const { groupLabel, includedBranches: groupedBranchNames = [] } = group;
        return (
          <OptionGroup key={groupLabel} label={groupLabel}>
            <>
              {groupedBranchNames?.reduce((res, bn) => {
                const branch = getBranch(bn, branches);
                if (branch) {
                  res.push(createOption(branch));
                }
                return res;
              }, [])}
            </>
          </OptionGroup>
        );
      })}
      {showEol && <Option value="legacy">Legacy Docs</Option>}
    </Select>
  );
};

VersionDropdown.propTypes = {
  // TODO: add active version dropdown prop
  // consume from version context
  repoBranches: PropTypes.shape({
    branches: PropTypes.arrayOf(
      PropTypes.shape({
        gitBranchName: PropTypes.string.isRequired,
        versionSelectorLabel: PropTypes.string,
        urlSlug: PropTypes.string,
        active: PropTypes.bool.isRequired,
      })
    ).isRequired,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        groupLabel: PropTypes.string,
        groupDisplayURLPrefix: PropTypes.string,
        includedBranches: PropTypes.array,
      })
    ),
    siteBasePrefix: PropTypes.string.isRequired,
  }).isRequired,
  slug: PropTypes.string.isRequired,
  eol: PropTypes.bool.isRequired,
};

export default VersionDropdown;
