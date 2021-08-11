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

const StyledOptionLink = styled('a')`
  color: unset;

  :hover {
    color: unset;
    text-decoration: none;
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
    return branch['gitBranchName'];
  }
  // TODO: Am I understanding publishOriginalBranchName correctly?
  // if (!!branch['publishOriginalBranchName']) {
  //   console.warn(`Using original git branch name as version selector UI label for: ${branch['gitBranchName']}.`);
  //   return branch['gitBranchName'];
  // }
  return branch['versionSelectorLabel'] || createVersionLabel(branch['gitBranchName'], branch['urlSlug']);
};

// If a UI label is not specified for raw versions (e.g. v1.0), create one
// Example: 1.0 -> Version 1.0
// TODO: Shorten significantly, add capabilitys for 'v1.0' or 'android-v1.0'
const createVersionLabel = (gitBranchName = '', urlSlug = null) => {
  console.warn(`Automatically creating version label for ${gitBranchName}.`);
  if (!gitBranchName && !urlSlug) {
    console.warn('Unable to create version label - neither gitBranchName nor urlSlug defined');
    return 'Version Name Unknown';
  }
  // We can reasonably expect names like "v2.0"
  // TODO: check if version is !isNaN or 'v' + !isNan
  const isNumeric = (version = '') => !isNaN(version);

  // If numeric, append 'Version ' to urlSlug or gitBranchName.
  const label = gitBranchName || urlSlug;
  return isNumeric(label) ? `Version ${label}` : label;
};

// Returns all branches that are neither in 'groups' nor inactive
const getActiveUngroupedBranches = (branches, groups) => {
  const groupedBranchNames = groups.map((g) => g['includedBranches']).flat();
  return branches.filter((b) => !groupedBranchNames.includes(b['gitBranchName']) && !!b['active']);
};

const VersionDropdown = ({ repoBranches: { branches, groups }, slug }) => {
  const siteMetadata = useSiteMetadata();
  const { parserBranch, pathPrefix, project, snootyEnv } = siteMetadata;

  if (!branches) {
    console.warn('VersionDropdown branches undefined');
    return null;
  }

  if (branches.length < 2) {
    console.warn('Insufficient branches supplied to VersionDropdown; expected 2 or more');
    return null;
  }

  console.log(groupBranches(branches, groups));

  const generatePrefix = (version) => {
    // Manual is a special case because it does not use a path prefix (found at root of docs.mongodb.com)
    const isManualProduction = project === 'docs' && snootyEnv === 'production';
    if (isManualProduction) {
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

  // Return a branch object from branches that matches supplied branchName
  // Typically used to associate a branchName from 'groups' with a branchName in 'branches'
  const findBranch = (branchName) => {
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
    const branchSlug = branch['urlSlug'] || branch['gitBranchName'];
    const url = getUrl(branchSlug);
    // TODO: Value should be unique -- not UI label, which could be have multiples
    // of v1.0, for example
    return (
      <Option key={branchSlug} value={UIlabel}>
        <StyledOptionLink href={url}>{UIlabel}</StyledOptionLink>
      </Option>
    );
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
      onChange={navigate}
      placeholder={null}
      size={Size.Large}
      popoverZIndex={3}
      value={parserBranch}
      usePortal={false}
    >
      {activeUngroupedBranches && activeUngroupedBranches.map((b) => createOption(b))}
      {groups &&
        groups.map((group) => {
          const { groupLabel, includedBranches: groupedBranchNames = [] } = group;
          return (
            <OptionGroup label={groupLabel}>
              {groupedBranchNames && groupedBranchNames.map((bn) => createOption(findBranch(bn)))}
            </OptionGroup>
          );
        })}
      {needsLegacyDropdown(branches) && (
        <Option value="legacy">
          <StyledOptionLink href={getUrl('legacy')}>Legacy Docs</StyledOptionLink>
        </Option>
      )}
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
    groups: PropTypes.shape({
      label: PropTypes.arrayOf(PropTypes.string),
    }),
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

export default VersionDropdown;
