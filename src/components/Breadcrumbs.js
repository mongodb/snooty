import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { getNestedValue } from '../utils/get-nested-value';

const Breadcrumbs = ({ parentPaths, slugTitleMapping }) => (
  <div className="bc">
    {parentPaths && (
      <ul>
        {parentPaths.map((path, index) => (
          <li key={path}>
            <Link to={`/${path}`}>{getNestedValue([path], slugTitleMapping)}</Link>
            {index !== parentPaths.length - 1 && <span className="bcpoint"> &gt; </span>}
          </li>
        ))}
      </ul>
    )}
  </div>
);

Breadcrumbs.propTypes = {
  parentPaths: PropTypes.arrayOf(PropTypes.string),
  slugTitleMapping: PropTypes.shape({
    [PropTypes.string]: PropTypes.string,
  }).isRequired,
};

Breadcrumbs.defaultProps = {
  parentPaths: [],
};

export default Breadcrumbs;
