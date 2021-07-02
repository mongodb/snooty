import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import { Option, OptionGroup, Select, Size } from '@leafygreen-ui/select';
import { navigate as reachNavigate } from '@reach/router';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { theme } from '../theme/docsTheme';
import { generatePathPrefix } from '../utils/generate-path-prefix';
import { getLegacyProjectURL } from '../utils/get-legacy-project-url';
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

// Creates a mapping of active branch names to UI labels
const getBranchLabel = (branch) => {
  if (branch['active'] === false) {
    console.warn(`Retrieving branch UI label for legacy/EOL'd/inactive branch: ${branch['gitBranchName']}`);
    return branch['gitBranchName'];
  }
  return branch['versionSelectorLabel'] || createVersionLabel(branch['gitBranchName'], branch['urlSlug']);
};

// Generate a version label to be displayed to docs users (only called if none was specified)
// TODO: Shorten significantly
const createVersionLabel = (gitBranchName = '', urlSlug = null) => {
  if (!gitBranchName && !urlSlug) {
    console.warn('Unable to create version label - neither gitBranchName nor urlSlug defined');
    return 'Version Name Unknown';
  }
  // We can reasonably expect names like "v2.0"
  // TODO: check if version is !isNaN or 'v' + !isNan
  const isNumeric = (version = '') => !isNaN(version);

  // If numeric, append 'Version ' to urlSlug or gitBranchName.
  const label = urlSlug || gitBranchName;
  return isNumeric(label) ? `Version ${label}` : label;
};

const getActiveUngroupedGitBranchNames = (branches, groups) => {
  // for each group, concatenate it group["branches"]
  const groupedGitBranchNames = groups.map((g) => g['groupGitBranchNames']).flat();
  const ungroupedActiveGitBranches = branches.filter(
    (b) => !groupedGitBranchNames.includes(b['gitBranchName']) && b['active'] === true
  );
  const ungroupedActiveGitBranchNames = ungroupedActiveGitBranches.map((b) => b['gitBranchName']);
  return ungroupedActiveGitBranchNames;
};

const VersionDropdown = ({ repo_branches: { branches, groups }, slug }) => {
  const siteMetadata = useSiteMetadata();
  const { parserBranch, pathPrefix, project, snootyEnv } = siteMetadata;

  if (!branches) {
    console.warn('VersionDropdown branches undefined');
    return null;
  }

  // Do not render version dropdown if there is only one branch
  if (branches.length === 1) {
    console.warn('Only 1 branch supplied to VersionDropdown; expected 2 or more');
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

  const mapBranchNamesToOptions = (branchNames) => {
    return branchNames.map((branchName) => {
      const branchCandidates = branches.filter((b) => b['gitBranchName'] === branchName || b['urlSlug'] === branchName);
      // TODO: Should probably return null in the future (leaving for demo)
      if (branchCandidates.length === 0) {
        console.warn(
          `Could not find branch in 'branches' with gitBranchName or urlSlug: ${branchName}. Check 'groups'.`
        );
        return (
          <Option key={branchName} value={branchName}>
            <StyledOptionLink href={getUrl(branchName)}>{branchName}</StyledOptionLink>
          </Option>
        );
      }
      const branch = branchCandidates[0];
      const UIlabel = getBranchLabel(branch);
      const branchValue = branch['urlSlug'] || branch['gitBranchName'];
      const url = getUrl(branchValue);
      return (
        <Option key={branchValue} value={branchValue}>
          <StyledOptionLink href={url}>{UIlabel}</StyledOptionLink>
        </Option>
      );
    });
  };

  const activeUngroupedGitBranchNames = getActiveUngroupedGitBranchNames(branches, groups) || [];
  // TODO: Unfortunately, the Select component seems to buck the ConditionalWrapper component
  // It would be nice to either use the ConditionalWrapper OR have the OptionGroup not take
  // up space when a label is empty-string
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
      {groups &&
        groups.map((group) => {
          const { groupLabel, groupGitBranchNames } = group;
          return (
            <OptionGroup label={groupLabel}>
              {groupGitBranchNames && mapBranchNamesToOptions(groupGitBranchNames)}
            </OptionGroup>
          );
        })}
      {activeUngroupedGitBranchNames && mapBranchNamesToOptions(activeUngroupedGitBranchNames)}
      {needsLegacyDropdown(branches) && (
        <Option value="legacy">
          <StyledOptionLink href={getUrl('legacy')}>Legacy Docs</StyledOptionLink>
        </Option>
      )}
    </StyledSelect>
  );
};

VersionDropdown.propTypes = {
  repo_branches: PropTypes.shape({
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
