import React from 'react';
import PropTypes from 'prop-types';
import Link from './Link';
import { formatText } from '../utils/format-text';
import { getNestedValue } from '../utils/get-nested-value';
import { reportAnalytics } from '../utils/report-analytics';

const Breadcrumbs = ({ parentPaths, slugTitleMapping }) => (
  <div className="bc">
    {parentPaths && (
      <ul>
        {parentPaths.map((path, index) => {
          const title = getNestedValue([path], slugTitleMapping);
          return (
            <li key={path}>
              <Link
                to={path}
                onClick={() => {
                  reportAnalytics('BreadcrumbClick', {
                    areaFrom: 'Breadcrumb',
                    parentPaths: parentPaths,
                    breadcrumbClicked: path,
                  });
                }}
              >
                {formatText(title)}
              </Link>
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
