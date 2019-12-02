import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { generatePathPrefix } from '../utils/generate-path-prefix';

const Dropdown = ({
  pathname,
  publishedBranches: {
    version: { published },
  },
}) => {
  const siteMetadata = useSiteMetadata();
  const { parserBranch } = siteMetadata;
  const [hidden, setHidden] = useState(true);
  return (
    <div className={`btn-group btn-group-xs pull-right ${hidden ? '' : 'open'}`}>
      <button
        onClick={() => setHidden(!hidden)}
        type="button"
        className="version-button dropdown-toggle"
        data-toggle="dropdown"
      >
        {parserBranch}
      </button>
      <ul className="dropdown-menu" role="menu">
        {published.map(version => (
          <li key={version}>
            <a className="version-selector" href={`${generatePathPrefix(siteMetadata)}${pathname}`}>
              {version}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

Dropdown.propTypes = {
  pathname: PropTypes.string.isRequired,
};

export default Dropdown;
