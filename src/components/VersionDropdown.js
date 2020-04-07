import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { generatePathPrefix } from '../utils/generate-path-prefix';
import { normalizePath } from '../utils/normalize-path';
import dropdownStyles from '../styles/version-dropdown.module.css';
import Button from '@leafygreen-ui/button';

const zip = (a, b) => {
  // Zip arrays a and b into an object where a is used for keys and b for values
  const dict = {};
  a.forEach((key, i) => (dict[key] = b[i]));
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
  const { parserBranch } = siteMetadata;
  const [hidden, setHidden] = useState(true);

  const prefixVersion = version => {
    // Display as "Version X" on menu if numeric version
    const isNumeric = version => !isNaN(version.split()[0]);
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
  const gitNamedMapping = zip(gitBranches, published);
  const currentBranch = gitNamedMapping[parserBranch];

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

  return (
    <div ref={wrapperRef} className="btn-group version-sidebar">
      <Button
        variant="default"
        className="version-button dropdown-toggle"
        title="Select version"
        onClick={() => setHidden(!hidden)}
        size="medium"
      >
        {prefixVersion(currentBranch)}
        <span className={['caret', dropdownStyles.caret].join(' ')}></span>
      </Button>
      {!hidden && (
        <ul className={['dropdown-menu', dropdownStyles.menu].join(' ')} role="menu">
          {active.map(version => {
            const url = normalizePath(`${generatePathPrefix({ ...siteMetadata, parserBranch: version })}/${slug}`);
            return (
              <li className={currentBranch === version ? 'active' : ''} key={version}>
                <a className="version-selector" href={url}>
                  {prefixVersion(version)}
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
    }).isRequired,
    git: PropTypes.shape({
      branches: PropTypes.shape({
        published: PropTypes.arrayOf(PropTypes.string).isRequired,
        active: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

export default VersionDropdown;
