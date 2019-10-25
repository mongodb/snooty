import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { usePublishedBranches } from '../hooks/use-published-branches';
import { useSiteMetadata } from '../hooks/use-site-metadata';

const Dropdown = ({ pathname }) => {
  const versions = usePublishedBranches();
  const { branch, project, user } = useSiteMetadata();
  const [hidden, setHidden] = useState(true);
  return (
    <div className={`btn-group btn-group-xs pull-right ${hidden ? '' : 'open'}`}>
      <button
        onClick={() => setHidden(!hidden)}
        type="button"
        className="version-button dropdown-toggle"
        data-toggle="dropdown"
      >
        {branch}
      </button>
      <ul className="dropdown-menu" role="menu">
        {versions.map(version => (
          <li key={version}>
            <a className="version-selector" href={`${project}/${user}/${branch}${pathname}`}>
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
