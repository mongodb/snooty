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
    font-size: 16px;
  }

  button {
    z-index: 2;
  }
`;

const OptionLink = styled('a')`
  color: unset;

  :hover {
    color: unset;
    text-decoration: none;
  }
`;

const VersionDropdown = ({ repo_branches: { branches, groups }, slug }) => {
  const siteMetadata = useSiteMetadata();
  const { parserBranch, pathPrefix, project, snootyEnv } = siteMetadata;

  // Do not render version dropdown if there is only one branch
  if (branches.length <= 1) {
    return null;
  }

  const versionLabel = (gitBranchName = '', urlSlug = null, versionSelectorLabel = null) => {
    // Display value of versionSelectorLabel if it's set
    if (versionSelectorLabel) {
      return `${versionSelectorLabel}`;
    }

    const isNumeric = (version = '') => {
      const [firstWord] = version.split();
      return !isNaN(firstWord);
    };

    // Display as Version X on menu if numeric version (based on the urlSlug field).
    if (urlSlug) {
      return `${isNumeric(urlSlug) ? 'Version ' : ''}${urlSlug}`;
    }
    // Display as Version X on menu if numeric version (based on the gitBranchName field).
    else {
      return `${isNumeric(gitBranchName) ? 'Version ' : ''}${gitBranchName}`;
    }
  };

  const gitNamedMapping = (branches = []) => {
    var branchNameToLabel = {};
    for (let branch of branches) {
      if (branch['active'] === false) {
        continue;
      }
      const branchName = branch['urlSlug'] ? branch['urlSlug'] : branch['gitBranchName'];
      const UIlabel = versionLabel(branch['gitBranchName'], branch['urlSlug'], branch['versionSelectorLabel']);
      branchNameToLabel[branchName] = UIlabel;
    }
    console.log(branchNameToLabel);
    return branchNameToLabel;
  };

  const legacyNeeded = (branches = []) => {
    var count = 0;
    branches.forEach((branch) => {
      if (branch['active'] === false) {
        count++;
      }
    });
    return count >= 1 ? true : false;
  };

  const groupBranches = (branches, groups) => {
    const getGroup = (branch = {}, groups = {}) => {
      var groupName = 'ungrouped';
      for (let group of groups) {
        if (
          group['includedBranches'].includes(branch['gitBranchName']) ||
          group['includedBranches'].includes(branch['urlSlug'])
        ) {
          groupName = group['groupLabel'];
        }
      }
      return groupName;
    };

    var newGroupMapping = {};
    branches.forEach((branch) => {
      if (!newGroupMapping[getGroup(branch, groups)]) {
        newGroupMapping[getGroup(branch, groups)] = [];
      }
      newGroupMapping[getGroup(branch, groups)].push(branch);
    });

    return newGroupMapping;
  };

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

  const navigate = (value) => {
    const destination = getUrl(value);
    reachNavigate(destination);
  };

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
      {Object.entries(gitNamedMapping(branches)).map(([branch, name]) => {
        const url = getUrl(branch);
        return (
          <Option key={branch} value={branch}>
            <OptionLink href={url}>{name}</OptionLink>
          </Option>
        );
      })}
      {legacyNeeded(branches) === true && (
        <Option value="legacy">
          <OptionLink href={getUrl('legacy')}>Legacy Docs</OptionLink>
        </Option>
      )}
    </StyledSelect>
  );
};

VersionDropdown.propTypes = {
  repo_branches: PropTypes.shape({
    branches: PropTypes.shape({
      gitBranchName: PropTypes.string.isRequired,
      versionSelectorLabel: PropTypes.string,
      urlSlug: PropTypes.string,
      active: PropTypes.bool.isRequired,
    }).isRequired,
    groups: PropTypes.shape({
      label: PropTypes.arrayOf(PropTypes.string),
    }),
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

export default VersionDropdown;
