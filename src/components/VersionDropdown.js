import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Option, Select, Size } from '@leafygreen-ui/select';
import { navigate as reachNavigate } from '@reach/router';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { theme } from '../theme/docsTheme';
import { generatePathPrefix } from '../utils/generate-path-prefix';
import { normalizePath } from '../utils/normalize-path';

const zip = (a, b) => {
  // Zip arrays a and b into an object where a is used for keys and b for values
  const shorter = a.length > b.length ? b : a;
  const dict = {};
  shorter.forEach((key, i) => (dict[a[i]] = b[i]));
  return dict;
};

const StyledSelect = styled(Select)`
  margin: ${theme.size.default} ${theme.size.medium} ${theme.size.medium} ${theme.size.medium};

  span {
    font-size: 16px;
  }

  // Remove when mongodb-docs.css is removed
  a {
    color: unset;
  }
`;

const OptionLink = styled('a')`
  color: unset;

  :hover {
    color: unset;
    text-decoration: none;
  }
`;

const VersionDropdown = ({
  publishedBranches: {
    version: { published, active },
    git: {
      branches: { published: gitBranches },
    },
  },
  slug,
}) => {
  const siteMetadata = useSiteMetadata();
  const { parserBranch, pathPrefix, project, snootyEnv } = siteMetadata;

  const prefixVersion = (version) => {
    // Display as "Version X" on menu if numeric version
    const isNumeric = (version = '') => {
      const [firstWord] = version.split();
      return !isNaN(firstWord);
    };
    return `${isNumeric(version) ? 'Version ' : ''}${version}`;
  };

  // Zip two sections of data to map git branches to their "pretty" names
  const gitNamedMapping = zip(gitBranches, active);

  // Don't render dropdown if there is only 1 version of the repo
  if (!active || active.length <= 1) {
    return null;
  }

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
    const legacyDocsURL = `https://docs.mongodb.com/legacy/?site=${project}`;
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
      value={parserBranch}
    >
      {Object.entries(gitNamedMapping).map(([branch, name]) => {
        const url = getUrl(branch);
        return (
          <Option key={branch} value={branch}>
            <OptionLink href={url}>{prefixVersion(name)}</OptionLink>
          </Option>
        );
      })}
      {published.length > active.length && (
        <Option value="legacy">
          <OptionLink href={getUrl('legacy')}>Legacy Docs</OptionLink>
        </Option>
      )}
    </StyledSelect>
  );
};

VersionDropdown.propTypes = {
  publishedBranches: PropTypes.shape({
    version: PropTypes.shape({
      published: PropTypes.arrayOf(PropTypes.string).isRequired,
      active: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    git: PropTypes.shape({
      branches: PropTypes.shape({
        published: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

export default VersionDropdown;
