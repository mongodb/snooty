import React from 'react';
import PropTypes from 'prop-types';
import Link from './Link';
import { formatText } from '../utils/format-text';
import { getNestedValue } from '../utils/get-nested-value';

const Breadcrumbs = ({ parentPaths, slugTitleMapping }) => (
  <div className="bc">
    {parentPaths && (
      <ul>
        {parentPaths.map((path, index) => {
          const title = getNestedValue([path], slugTitleMapping);
          return (
            <li key={path}>
              {/* TODO: Replace <a> with <Link> when back button behavior is fixed for the component.
              GitHub issue: https://github.com/gatsbyjs/gatsby/issues/8357 */}
              <Link to={path}>{formatText(title)}</Link>
              {index !== parentPaths.length - 1 && <span className="bcpoint"> &gt; </span>}
            </li>
          );
        })}
      </ul>
    )}
  </div>
);

Breadcrumbs.propTypes = {
  parentPaths: PropTypes.arrayOf(PropTypes.string),
  slugTitleMapping: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.string])),
};

Breadcrumbs.defaultProps = {
  parentPaths: [],
  slugTitleMapping: {},
};

export default Breadcrumbs;
