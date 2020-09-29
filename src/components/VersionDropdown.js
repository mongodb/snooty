import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { generatePathPrefix } from '../utils/generate-path-prefix';
import { normalizePath } from '../utils/normalize-path';
import dropdownStyles from '../styles/version-dropdown.module.css';
import Button from '@leafygreen-ui/button';

const zip = (a, b) => {
  // Zip arrays a and b into an object where a is used for keys and b for values
  const shorter = a.length > b.length ? b : a;
  const dict = {};
  shorter.forEach((key, i) => (dict[a[i]] = b[i]));
  return dict;
};

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
  const [hidden, setHidden] = useState(true);

  const prefixVersion = version => {
    // Display as "Version X" on menu if numeric version
    const isNumeric = (version = '') => {
      const [firstWord] = version.split();
      return !isNaN(firstWord);
    };
    return `${isNumeric(version) ? 'Version ' : ''}${version}`;
  };

  const useOutsideHandler = ref => {
    // Close dropdown if user clicks outside of the Version button
    const handleClickOutside = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        setHidden(true);
      }
    };

    useEffect(() => {
      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside);
      };
    });
  };

  // Zip two sections of data to map git branches to their "pretty" names
  const gitNamedMapping = zip(gitBranches, active);
  const currentBranch = gitNamedMapping[parserBranch] || parserBranch;

  const wrapperRef = useRef(null);
  useOutsideHandler(wrapperRef);

  // Handle cases where EOL versions exist
  const legacyDocsURL = `https://docs.mongodb.com/legacy/?site=${process.env.GATSBY_SITE}`;
  let legacyDocsHTML = '';

  if (published.length > active.length) {
    legacyDocsHTML = (
      <li className="">
        <a className="version-selector" href={legacyDocsURL}>
          Legacy Docs
        </a>
      </li>
    );
  }

  // Don't render dropdown if there is only 1 version of the repo
  if (!active || active.length <= 1) {
    return null;
  }

  const generatePrefix = version => {
    // Manual is a special case because it does not use a path prefix (found at root of docs.mongodb.com)
    const isManualProduction = project === 'manual' && snootyEnv === 'production';
    if (isManualProduction) {
      return `/${version}`;
    }

    // For production builds, append version after project name
    if (pathPrefix) {
      const [, project] = pathPrefix.split('/');
      return `/${project}/${version}`;
    }

    // For staging, replace current version in dynamically generated path prefix
    return generatePathPrefix({ ...siteMetadata, parserBranch: version });
  };

  return (
    <div ref={wrapperRef} className="btn-group version-sidebar">
      <Button
        variant="default"
        className={['version-button', 'dropdown-toggle', dropdownStyles.button].join(' ')}
        title="Select version"
        onClick={() => setHidden(!hidden)}
        size="large"
      >
        {prefixVersion(currentBranch)}
        <span className={['caret', dropdownStyles.caret].join(' ')}></span>
      </Button>
      {!hidden && (
        <ul className={['dropdown-menu', dropdownStyles.menu].join(' ')} role="menu">
          {Object.entries(gitNamedMapping).map(([branch, name]) => {
            const url = normalizePath(`${generatePrefix(branch)}/${slug}`);
            return (
              <li className={parserBranch === branch ? 'active' : ''} key={branch}>
                <a className="version-selector" href={url}>
                  {prefixVersion(name)}
                </a>
              </li>
            );
          })}
          {legacyDocsHTML}
        </ul>
      )}
    </div>
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
