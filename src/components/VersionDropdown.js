import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@leafygreen-ui/button';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { generatePathPrefix } from '../utils/generate-path-prefix';
import dropdownStyles from '../styles/version-dropdown.module.css';

const zip = (a, b) => {
  // Zip arrays a and b into an object where a is used for keys and b for values
  const dict = {};
  a.forEach((key, i) => (dict[key] = b[i]));
  return dict;
};

const VersionDropdown = ({
  pathname,
  publishedBranches: {
    git: {
      branches: { published: gitBranches },
    },
    version: { published },
  },
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

  const gitNamedMapping = zip(gitBranches, published);
  const currentBranch = gitNamedMapping[parserBranch];

  const wrapperRef = useRef(null);
  useOutsideHandler(wrapperRef);

  return (
    <div ref={wrapperRef} className="btn-group version-sidebar">
      <Button onClick={() => setHidden(!hidden)} className={dropdownStyles.button} title="Select branch">
        {prefixVersion(currentBranch)}
      </Button>
      {!hidden && (
        <ul className={['dropdown-menu', dropdownStyles.menu].join(' ')} role="menu">
          {published.map(version => (
            <li className={currentBranch === version ? 'active' : ''} key={version}>
              <a
                className="version-selector"
                href={`${generatePathPrefix({ ...siteMetadata, parserBranch: version })}${pathname}`}
              >
                {prefixVersion(version)}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

VersionDropdown.propTypes = {
  pathname: PropTypes.string.isRequired,
};

export default VersionDropdown;
