import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { cx, css as LeafyCSS } from '@leafygreen-ui/emotion';
import { uiColors } from '@leafygreen-ui/palette';
import { Option, OptionGroup, Select, Size } from '@leafygreen-ui/select';
import { navigate as reachNavigate } from '@reach/router';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { theme } from '../theme/docsTheme';
import { generatePathPrefix } from '../utils/generate-path-prefix';
import { normalizePath } from '../utils/normalize-path';
import { assertTrailingSlash } from '../utils/assert-trailing-slash';
import { baseUrl } from '../utils/dotcom';
import { deprecated } from '../layouts/index';

const StyledSelect = styled(Select)`
  margin: ${theme.size.small} ${theme.size.medium} ${theme.size.small} ${theme.size.medium};

  & > button {
    background-color: ${uiColors.white};
  }

  span {
    font-size: ${theme.fontSize.default};
  }
  ${'' /* Render version dropdown text in front of the Sidebar text */}
  button {
    z-index: 2;
  }
`;

// Returns true if there are any inactive (EOL'd/'legacy') branches
const needsLegacyDropdown = (branches = []) => {
  const isLegacy = (branch = {}) => !branch['active'];
  return branches.some(isLegacy);
};

// Gets UI labels for supplied active branch names
const getUILabel = (branch) => {
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

const setOptionSlug = (branch) => {
  return branch['urlSlug'] || branch['gitBranchName'];
};

const createOption = (branch) => {
  const UIlabel = getUILabel(branch);
  const slug = setOptionSlug(branch);
  return (
    <Option key={slug} value={slug}>
      {UIlabel}
    </Option>
  );
};

const VersionDropdown = ({ repoBranches: { branches, groups }, slug }) => {
  const siteMetadata = useSiteMetadata();
  const { parserBranch, pathPrefix, project, snootyEnv } = siteMetadata;

  if ((branches?.length ?? 0) < 2) {
    console.warn('Insufficient branches supplied to VersionDropdown; expected 2 or more');
    return null;
  }

  // For exclusively Realm SDK pages, we show a subset of the versions depending
  // on the current page selection. For example, on the Android SDK page, we only
  // show Android SDK versions in the version dropdown box.
  if (project === 'realm' && slug.startsWith('sdk/')) {
    groups = groups.filter((g) => slug.startsWith(g?.['sharedSlugPrefix'])) || groups;
    if ((groups?.length ?? 0) === 1) {
      // Get the branchNames from the indicated group, e.g. ['android-v1.0', 'android-v2.0', ...]
      const sdkBranchNames = groups[0]['includedBranches'];
      branches = branches.filter((b) => sdkBranchNames.includes(b['gitBranchName']));
    } else {
      console.warn(`Unexpected behavior with Realm SDK version grouping. Check 'groups' and 'sharedSlugPrefix'.`);
    }
  }

  const generatePrefix = (version) => {
    // Manual production is a special case because it does not use a path
    // prefix (found at root of docs.mongodb.com)
    if (project === 'docs' && snootyEnv === 'production') {
      return `/${version}`;
    }

    // For production builds, append version after project name
    if (pathPrefix) {
      const noVersion = pathPrefix.substr(0, pathPrefix.lastIndexOf('/'));
      return `${noVersion}/${version}`;
    }

    // For development
    if (snootyEnv === 'development') {
      console.warn(
        `Applying experimental development environment-specific routing for versions.
         Behavior may differ in both staging and production. See VersionDropdown.js for more detail.`
      );
      return `/${version}`;
    }

    // For staging, replace current version in dynamically generated path prefix
    return generatePathPrefix({ ...siteMetadata, parserBranch: version });
  };

  const getUrl = (optionValue) => {
    if (optionValue === 'legacy') {
      return `${baseUrl(true)}/legacy/?site=${project}`;
    }
    const prefix = generatePrefix(optionValue);
    if (project === 'realm' && optionValue.startsWith('sdk/')) {
      console.warn(`Applying routing logic that is specific to Realm SDKs.`);
      return normalizePath(prefix);
    }
    return assertTrailingSlash(normalizePath(`${prefix}/${slug}`));
  };

  // Used exclusively by the LG Select component's onChange function, which receives
  // the 'value' prop from the selected Option component
  const navigate = (optionValue) => {
    const destination = getUrl(optionValue);
    reachNavigate(destination);
  };

  const activeUngroupedBranches = getActiveUngroupedBranches(branches, groups) || [];

  // Attempts to reconcile differences between urlSlug and the parserBranch provided to this component
  // Used to ensure that the value of the select is set to the urlSlug if the urlSlug is present and differs from the gitBranchName
  const slugFromParserBranch = (parserBranch, branches) => {
    let slug = parserBranch;
    for (let branch of branches) {
      if (branch.gitBranchName === parserBranch) {
        return setOptionSlug(branch);
      }
    }
    return slug;
  };

  const eolVersionFlipperStyle = LeafyCSS`
  & > button {
    background-color: ${uiColors.gray.light2} !important;
    color: ${uiColors.gray.base} !important;
  }
`;

  // TODO: Unfortunately, the Select component seems to buck the ConditionalWrapper component
  // It would be nice to either use the ConditionalWrapper to disable the OptionGroup
  // OR have the OptionGroup not take up space when a label is empty-string. For now,
  // ungrouped branches are handled in a separate array.
  return (
    <StyledSelect
      allowDeselect={false}
      className={cx(deprecated ? eolVersionFlipperStyle : '')}
      aria-labelledby="View a different version of documentation."
      defaultValue="master"
      onChange={navigate}
      placeholder={'Select a version'}
      popoverZIndex={3}
      size={Size.Large}
      value={slugFromParserBranch(parserBranch, branches)}
      usePortal={false}
      disabled={deprecated}
    >
      {activeUngroupedBranches?.map((b) => createOption(b))}
      {groups?.map((group) => {
        const { groupLabel, includedBranches: groupedBranchNames = [] } = group;
        return (
          <OptionGroup key={groupLabel} label={groupLabel}>
            <>{groupedBranchNames?.map((bn) => createOption(getBranch(bn, branches)))}</>
          </OptionGroup>
        );
      })}
      {needsLegacyDropdown(branches) && <Option value="legacy">Legacy Docs</Option>}
    </StyledSelect>
  );
};

VersionDropdown.propTypes = {
  repoBranches: PropTypes.shape({
    branches: PropTypes.arrayOf(
      PropTypes.shape({
        gitBranchName: PropTypes.string.isRequired,
        versionSelectorLabel: PropTypes.string,
        urlSlug: PropTypes.string,
        active: PropTypes.string.isRequired,
      })
    ).isRequired,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        groupLabel: PropTypes.string,
        groupDisplayURLPrefix: PropTypes.string,
        includedBranches: PropTypes.array,
      })
    ),
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

export default VersionDropdown;
