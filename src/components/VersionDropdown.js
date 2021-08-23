import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import { Option, OptionGroup, Select, Size } from '@leafygreen-ui/select';
import { navigate as reachNavigate } from '@reach/router';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { theme } from '../theme/docsTheme';
import { generatePathPrefix } from '../utils/generate-path-prefix';
import { normalizePath } from '../utils/normalize-path';
import { baseUrl } from '../utils/dotcom';

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

// Returns true if there are any inactive (EOL'd/"legacy") branches
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
  const numeric_label = label.replace(/^\D+/g, '');

  return numeric_label ? `Version ${numeric_label}` : label;
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

  // TODO: less unsafe return
  return branchCandidates[0];
};

const createOption = (branch) => {
  const UIlabel = getUILabel(branch);
  const slug = branch['urlSlug'] || branch['gitBranchName'];
  return (
    <Option key={slug} value={branch['gitBranchName']}>
      {UIlabel}
    </Option>
  );
};

const VersionDropdown = ({ repoBranches: { branches, groups }, slug }) => {
  const siteMetadata = useSiteMetadata();
  const { parserBranch, pathPrefix, project, snootyEnv } = siteMetadata;

  if (branches.length < 2) {
    console.warn('Insufficient branches supplied to VersionDropdown; expected 2 or more');
    return null;
  }

  // For exclusively Realm SDK pages, we show a subset of the versions depending
  // on the current page selection. For example, on the Android SDK page, we only
  // show Android SDK versions in the version dropdown box.
  if (project === 'realm' && slug.startsWith('sdk/')) {
    groups = groups.filter((g) => slug.startsWith(g['sharedSlugPrefix'])) || groups;
    if (groups && groups.length === 1) {
      // Get the branchNames from the indicated group, e.g. ["android-v1.0", "android-v2.0", ...]
      const sdkBranchNames = groups[0]['includedBranches'];
      branches = branches.filter((b) => sdkBranchNames.includes(b['gitBranchName']));
    } else {
      console.warn("Unexpected behavior with Realm SDK version grouping. Check 'groups' and 'sharedSlugPrefix'.");
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

    // For staging, replace current version in dynamically generated path prefix
    return generatePathPrefix({ ...siteMetadata, parserBranch: version });
  };

  const getUrl = (value) => {
    const legacyDocsURL = `${baseUrl(true)}/legacy/?site=${project}`;
    return value === 'legacy' ? legacyDocsURL : normalizePath(`${generatePrefix(value)}/${slug}`);
  };

  // Used exclusively by the LG Select component's onChange function, which receives
  // the 'value' prop from the selected Option component
  const navigate = (optionValue) => {
    const destination = getUrl(optionValue);
    reachNavigate(destination);
  };

  const activeUngroupedBranches = getActiveUngroupedBranches(branches, groups) || [];

  // TODO: Unfortunately, the Select component seems to buck the ConditionalWrapper component
  // It would be nice to either use the ConditionalWrapper to disable the OptionGroup
  // OR have the OptionGroup not take up space when a label is empty-string. For now,
  // ungrouped branches are handled in a separate array.
  return (
    <StyledSelect
      allowDeselect={false}
      aria-labelledby="View a different version of documentation."
      defaultValue="master"
      onChange={navigate}
      placeholder={'Select a version'}
      popoverZIndex={3}
      size={Size.Large}
      popoverZIndex={3}
      value={parserBranch}
      usePortal={false}
    >
      {activeUngroupedBranches && activeUngroupedBranches.map((b) => createOption(b))}
      {process.env.GATSBY_FEATURE_FLAG_SDK_VERSION_DROPDOWN &&
        groups &&
        groups.map((group) => {
          const { groupLabel, includedBranches: groupedBranchNames = [] } = group;
          return (
            <OptionGroup key={groupLabel} label={groupLabel}>
              <>{groupedBranchNames && groupedBranchNames.map((bn) => createOption(getBranch(bn, branches)))}</>
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
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

export default VersionDropdown;
